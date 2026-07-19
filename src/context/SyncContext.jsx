import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured, checkSupabaseConnection } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { uploadMusicFile, deleteMusicFile } from '../services/uploadService'
import { syncLibraryMetadata, syncUserData } from '../services/syncService'

const SyncContext = createContext(null)

export function SyncProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [syncStatus, setSyncStatus] = useState('idle') // idle, syncing, error
  const [uploadProgress, setUploadProgress] = useState(0)
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 })
  const [cloudAvailable, setCloudAvailable] = useState(null) // null = checking, true/false = result

  // Check Supabase connectivity on mount
  useEffect(() => {
    let cancelled = false
    async function check() {
      const available = await checkSupabaseConnection()
      if (!cancelled) {
        setCloudAvailable(available)
        if (!available) {
          console.info('[SyncContext] Supabase unavailable — operating in local-only mode')
        }
      }
    }
    check()
    return () => { cancelled = true }
  }, [])

  // Load data from Supabase when user authenticates
  const loadUserData = useCallback(async () => {
    if (!user) return

    setSyncStatus('syncing')

    try {
      // Load favorites
      const { data: favData, error: favError } = await supabase
        .from('favorites')
        .select('track_id')
        .eq('user_id', user.id)

      if (favError) throw favError
      setFavorites(favData?.map(f => f.track_id) || [])

      // Load playlists with tracks
      const { data: playlistData, error: playlistError } = await supabase
        .from('playlists')
        .select(`
          id,
          name,
          created_at,
          playlist_tracks (
            track_id,
            position
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (playlistError) throw playlistError

      const formattedPlaylists = playlistData?.map(p => ({
        id: p.id,
        name: p.name,
        created_at: p.created_at,
        tracks: p.playlist_tracks
          ?.sort((a, b) => a.position - b.position)
          .map(pt => pt.track_id) || []
      })) || []

      setPlaylists(formattedPlaylists)
      setSyncStatus('idle')
    } catch (error) {
      console.error('Sync error:', error)
      setSyncStatus('error')
    }
  }, [user])

  useEffect(() => {
    if (isAuthenticated) {
      loadUserData()
    } else {
      // Reset to local state when logged out
      setFavorites([])
      setPlaylists([])
    }
  }, [isAuthenticated, loadUserData])

  // Favorites operations
  const toggleFavorite = useCallback(async (trackId) => {
    if (!isAuthenticated) {
      // Local-only mode
      setFavorites(prev =>
        prev.includes(trackId)
          ? prev.filter(id => id !== trackId)
          : [...prev, trackId]
      )
      return
    }

    const isFav = favorites.includes(trackId)

    try {
      if (isFav) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('track_id', trackId)
        setFavorites(prev => prev.filter(id => id !== trackId))
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, track_id: trackId })
        setFavorites(prev => [...prev, trackId])
      }
    } catch (error) {
      console.error('Favorite sync error:', error)
    }
  }, [isAuthenticated, favorites, user])

  // Playlist operations
  const createPlaylist = useCallback(async (name) => {
    const newPlaylist = {
      id: Date.now(),
      name,
      created_at: new Date().toISOString(),
      tracks: []
    }

    if (!isAuthenticated) {
      setPlaylists(prev => [newPlaylist, ...prev])
      return newPlaylist
    }

    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert({ user_id: user.id, name })
        .select()
        .single()

      if (error) throw error

      const created = {
        id: data.id,
        name: data.name,
        created_at: data.created_at,
        tracks: []
      }
      setPlaylists(prev => [created, ...prev])
      return created
    } catch (error) {
      console.error('Create playlist error:', error)
      return null
    }
  }, [isAuthenticated, user])

  const deletePlaylist = useCallback(async (playlistId) => {
    if (!isAuthenticated) {
      setPlaylists(prev => prev.filter(p => p.id !== playlistId))
      return
    }

    try {
      await supabase.from('playlists').delete().eq('id', playlistId)
      setPlaylists(prev => prev.filter(p => p.id !== playlistId))
    } catch (error) {
      console.error('Delete playlist error:', error)
    }
  }, [isAuthenticated])

  const addTrackToPlaylist = useCallback(async (playlistId, trackId) => {
    let position = 0

    setPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId && !p.tracks.includes(trackId)) {
          position = p.tracks.length
          return { ...p, tracks: [...p.tracks, trackId] }
        }
        return p
      })
    )

    if (!isAuthenticated) return

    try {
      await supabase
        .from('playlist_tracks')
        .insert({
          playlist_id: playlistId,
          track_id: trackId,
          position
        })
    } catch (error) {
      console.error('Add to playlist error:', error)
    }
  }, [isAuthenticated])

  const removeTrackFromPlaylist = useCallback(async (playlistId, trackId) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId
          ? { ...p, tracks: p.tracks.filter(id => id !== trackId) }
          : p
      )
    )

    if (!isAuthenticated) return

    try {
      await supabase
        .from('playlist_tracks')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('track_id', trackId)
    } catch (error) {
      console.error('Remove from playlist error:', error)
    }
  }, [isAuthenticated])

  const renamePlaylist = useCallback(async (playlistId, newName) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId ? { ...p, name: newName } : p
      )
    )

    if (!isAuthenticated) return

    try {
      await supabase
        .from('playlists')
        .update({ name: newName })
        .eq('id', playlistId)
    } catch (error) {
      console.error('Rename playlist error:', error)
    }
  }, [isAuthenticated])

  const reorderTrackInPlaylist = useCallback(async (playlistId, fromIndex, toIndex) => {
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id !== playlistId) return p
        const tracks = [...p.tracks]
        const [moved] = tracks.splice(fromIndex, 1)
        tracks.splice(toIndex, 0, moved)
        return { ...p, tracks }
      })
    )

    if (!isAuthenticated) return

    try {
      // For simplicity, re-insert all positions (small playlists)
      const playlist = playlists.find(p => p.id === playlistId)
      if (!playlist) return

      const newTracks = [...playlist.tracks]
      const [moved] = newTracks.splice(fromIndex, 1)
      newTracks.splice(toIndex, 0, moved)

      // Delete old and insert new positions
      await supabase
        .from('playlist_tracks')
        .delete()
        .eq('playlist_id', playlistId)

      const inserts = newTracks.map((trackId, index) => ({
        playlist_id: playlistId,
        track_id: trackId,
        position: index
      }))

      if (inserts.length > 0) {
        await supabase.from('playlist_tracks').insert(inserts)
      }
    } catch (error) {
      console.error('Reorder track error:', error)
    }
  }, [isAuthenticated, playlists])

  const value = {
    favorites,
    playlists,
    syncStatus,
    cloudAvailable,
    toggleFavorite,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    renamePlaylist,
    reorderTrackInPlaylist,
    isFavorite: (trackId) => favorites.includes(trackId),
    refresh: loadUserData,

    // Upload methods
    uploadMusic: async (file, path, onProgress) => {
      setUploadProgress(0)
      setSyncStatus('syncing')
      try {
        const result = await uploadMusicFile(file, path, (p) => {
          setUploadProgress(p)
          if (onProgress) onProgress(p)
        })
        setSyncStatus('idle')
        setUploadProgress(100)
        return result
      } catch (error) {
        setSyncStatus('error')
        throw error
      }
    },
    deleteMusic: deleteMusicFile,

    // Library sync
    syncLibrary: async (tracks) => {
      setSyncStatus('syncing')
      setSyncProgress({ current: 0, total: tracks.length })
      try {
        const result = await syncLibraryMetadata(tracks, (cur, tot) =>
          setSyncProgress({ current: cur, total: tot })
        )
        setSyncStatus(result.errors.length ? 'error' : 'idle')
        return result
      } catch (error) {
        setSyncStatus('error')
        throw error
      }
    },

    // User data sync
    syncUserDataToCloud: async (data) => {
      if (!user) throw new Error('Not authenticated')
      setSyncStatus('syncing')
      try {
        const result = await syncUserData(user.id, data)
        setSyncStatus('idle')
        await loadUserData()
        return result
      } catch (error) {
        setSyncStatus('error')
        throw error
      }
    },

    uploadProgress,
    syncProgress,
  }

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>
}

export const useSync = () => {
  const context = useContext(SyncContext)
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider')
  }
  return context
}