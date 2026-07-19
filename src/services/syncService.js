import { supabase } from '../lib/supabase'

/**
 * Sync local music library metadata to Supabase
 * Scans /music directory structure and upserts track metadata
 * @param {Array} localTracks - Array of track objects from local library
 * @param {function} onProgress - Progress callback (current, total)
 * @returns {Promise<{synced: number, errors: Array}>}
 */
export async function syncLibraryMetadata(localTracks = [], onProgress = null) {
  const results = { synced: 0, errors: [] }

  if (!localTracks.length) return results

  try {
    for (let i = 0; i < localTracks.length; i++) {
      const track = localTracks[i]

      if (onProgress) onProgress(i + 1, localTracks.length)

      const metadata = {
        id: track.id || generateTrackId(track),
        title: track.title || track.name || 'Unknown',
        artist: track.artist || 'Unknown Artist',
        album: track.album || null,
        duration: track.duration || null,
        file_path: track.file_path || track.path || null,
        storage_path: track.storage_path || null,
        created_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('tracks')
        .upsert(metadata, { onConflict: 'id' })

      if (error) {
        results.errors.push({ track: metadata.title, error: error.message })
      } else {
        results.synced++
      }
    }
  } catch (error) {
    results.errors.push({ track: 'batch', error: error.message })
  }

  return results
}

/**
 * Sync user favorites to Supabase
 * @param {string} userId
 * @param {Array<string>} trackIds
 */
export async function syncFavorites(userId, trackIds = []) {
  if (!userId) throw new Error('User ID required')

  try {
    // Delete existing favorites
    await supabase.from('favorites').delete().eq('user_id', userId)

    if (trackIds.length === 0) return { synced: 0 }

    // Insert new favorites
    const records = trackIds.map(trackId => ({
      user_id: userId,
      track_id: trackId,
      created_at: new Date().toISOString()
    }))

    const { error } = await supabase.from('favorites').insert(records)
    if (error) throw error

    return { synced: trackIds.length }
  } catch (error) {
    console.error('Favorites sync error:', error)
    throw error
  }
}

/**
 * Sync user playlists to Supabase
 * @param {string} userId
 * @param {Array} playlists - Array of {name, tracks: string[]}
 */
export async function syncPlaylists(userId, playlists = []) {
  if (!userId) throw new Error('User ID required')

  try {
    // Delete existing playlists for user
    const { data: existing } = await supabase
      .from('playlists')
      .select('id')
      .eq('user_id', userId)

    if (existing?.length) {
      const ids = existing.map(p => p.id)
      await supabase.from('playlist_tracks').delete().in('playlist_id', ids)
      await supabase.from('playlists').delete().in('id', ids)
    }

    let synced = 0
    for (const playlist of playlists) {
      const { data: newPlaylist, error: pError } = await supabase
        .from('playlists')
        .insert({ user_id: userId, name: playlist.name })
        .select()
        .single()

      if (pError) {
        console.error('Playlist insert error:', pError)
        continue
      }

      if (playlist.tracks?.length) {
        const trackRecords = playlist.tracks.map((trackId, index) => ({
          playlist_id: newPlaylist.id,
          track_id: trackId,
          position: index
        }))

        await supabase.from('playlist_tracks').insert(trackRecords)
      }

      synced++
    }

    return { synced }
  } catch (error) {
    console.error('Playlists sync error:', error)
    throw error
  }
}

/**
 * Full user data sync (favorites + playlists)
 */
export async function syncUserData(userId, { favorites = [], playlists = [] }) {
  const results = { favorites: 0, playlists: 0, errors: [] }

  try {
    if (favorites.length) {
      const favResult = await syncFavorites(userId, favorites)
      results.favorites = favResult.synced
    }
  } catch (e) {
    results.errors.push({ type: 'favorites', message: e.message })
  }

  try {
    if (playlists.length) {
      const plResult = await syncPlaylists(userId, playlists)
      results.playlists = plResult.synced
    }
  } catch (e) {
    results.errors.push({ type: 'playlists', message: e.message })
  }

  return results
}

function generateTrackId(track) {
  const key = `${track.artist || ''}-${track.title || track.name || ''}`
  return btoa(key).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)
}
