import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { getCities } from '../services/musicLibrary'
import { DEFAULT_VOLUME, TOAST_DURATION_MS } from '../lib/constants'

const PlayerContext = createContext(null)

const CITIES = getCities()

export function PlayerProvider({ children }) {
  const [selectedCityIndex, setSelectedCityIndex] = useState(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(() => {
    try {
      const saved = localStorage.getItem('qfm-volume')
      return saved !== null ? parseFloat(saved) : DEFAULT_VOLUME
    } catch {
      return DEFAULT_VOLUME
    }
  })
  const [currentTime, setCurrentTime] = useState(0)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off')
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')

  const audioRef = useRef(null)
  const currentTrackIndexRef = useRef(currentTrackIndex)
  const advanceTrackRef = useRef(null)
  const shuffledOrderRef = useRef(null)
  const toastTimerRef = useRef(null)

  currentTrackIndexRef.current = currentTrackIndex

  // Memoize derived data to avoid unnecessary re-computations on every render
  const selectedCity = useMemo(
    () => (selectedCityIndex !== null ? CITIES[selectedCityIndex] : null),
    [selectedCityIndex]
  )

  const currentTrack = useMemo(
    () => (selectedCity ? selectedCity.tracks[currentTrackIndex] : null),
    [selectedCity, currentTrackIndex]
  )

  const filteredTracks = useMemo(
    () => (selectedCity
      ? selectedCity.tracks.filter(t =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.artist.toLowerCase().includes(search.toLowerCase())
        )
      : []),
    [selectedCity, search]
  )

  // Persist volume
  useEffect(() => {
    try { localStorage.setItem('qfm-volume', String(volume)) }
    catch { /* ignore */ }
  }, [volume])

  const showToast = useCallback((msg) => {
    setToast(msg)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS)
  }, [])

  // Initialize audio (lazy: only one Audio instance for the entire app)
  useEffect(() => {
    const audio = new Audio()
    audio.volume = volume
    audioRef.current = audio

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onEnded = () => advanceTrackRef.current()

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.pause()
      audio.src = ''
    }
  }, [])

  // Load track when city or index changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    audio.src = currentTrack.src
    audio.load()
    setCurrentTime(0)

    if (isPlaying) {
      audio.play().catch(() => {})
    }
  }, [selectedCityIndex, currentTrackIndex])

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying])

  const advanceTrack = useCallback(() => {
    if (!selectedCity) return
    let next
    if (repeatMode === 'one') {
      next = currentTrackIndexRef.current
    } else if (isShuffled && shuffledOrderRef.current) {
      const idx = shuffledOrderRef.current.indexOf(currentTrackIndexRef.current)
      next = shuffledOrderRef.current[(idx + 1) % shuffledOrderRef.current.length]
    } else {
      next = (currentTrackIndexRef.current + 1) % selectedCity.tracks.length
    }
    setCurrentTrackIndex(next)
    setIsPlaying(true)
    showToast('Now playing: ' + selectedCity.tracks[next].title)
  }, [showToast, repeatMode, isShuffled, selectedCity])

  // Keep advanceTrack ref in sync so the audio 'ended' listener always calls the latest version
  advanceTrackRef.current = advanceTrack

  const goBack = useCallback(() => {
    setSelectedCityIndex(null)
    setIsPlaying(false)
    setSearch('')
  }, [])

  const selectCity = useCallback((index) => {
    setSelectedCityIndex(index)
    setCurrentTrackIndex(0)
    setIsPlaying(false)
    setSearch('')
    showToast('Entered ' + CITIES[index].name)
  }, [showToast])

  const togglePlay = useCallback(() => {
    if (!isPlaying && currentTrack) {
      showToast('Now playing: ' + currentTrack.title)
    }
    setIsPlaying(p => !p)
  }, [isPlaying, currentTrack, showToast])

  const handlePrev = useCallback(() => {
    if (!selectedCity) return
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0
      setCurrentTime(0)
      return
    }
    const newIndex = currentTrackIndex === 0 ? selectedCity.tracks.length - 1 : currentTrackIndex - 1
    setCurrentTrackIndex(newIndex)
    setIsPlaying(true)
    showToast('Now playing: ' + selectedCity.tracks[newIndex].title)
  }, [selectedCity, currentTime, currentTrackIndex, showToast])

  const handleNext = useCallback(() => {
    advanceTrack()
    setIsPlaying(true)
  }, [advanceTrack])

  const toggleShuffle = useCallback(() => {
    const newShuffle = !isShuffled
    setIsShuffled(newShuffle)
    if (newShuffle && selectedCity) {
      const others = selectedCity.tracks.map((_, i) => i).filter(i => i !== currentTrackIndex)
      for (let i = others.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[others[i], others[j]] = [others[j], others[i]]
      }
      shuffledOrderRef.current = [currentTrackIndex, ...others]
    } else {
      shuffledOrderRef.current = null
    }
    showToast(newShuffle ? 'Shuffle on' : 'Shuffle off')
  }, [isShuffled, selectedCity, currentTrackIndex, showToast])

  const toggleRepeat = useCallback(() => {
    const modes = ['off', 'all', 'one']
    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length]
    setRepeatMode(nextMode)
    showToast('Repeat: ' + nextMode)
  }, [repeatMode, showToast])

  const selectTrack = useCallback((id) => {
    if (!selectedCity) return
    const idx = selectedCity.tracks.findIndex(t => t.id === id)
    if (idx !== -1) {
      setCurrentTrackIndex(idx)
      setIsPlaying(true)
      showToast('Now playing: ' + selectedCity.tracks[idx].title)
    }
  }, [selectedCity, showToast])

  const handleProgressClick = useCallback((newTime) => {
    if (audioRef.current) audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }, [])

  const value = useMemo(() => ({
    // State
    selectedCityIndex,
    currentTrackIndex,
    isPlaying,
    volume,
    currentTime,
    isShuffled,
    repeatMode,
    toast,
    search,
    selectedCity,
    currentTrack,
    filteredTracks,

    // Actions
    goBack,
    selectCity,
    togglePlay,
    handlePrev,
    handleNext,
    toggleShuffle,
    toggleRepeat,
    selectTrack,
    handleProgressClick,
    setVolume,
    setSearch,
    showToast,
    setToast,
  }), [
    selectedCityIndex, currentTrackIndex, isPlaying, volume,
    currentTime, isShuffled, repeatMode, toast, search,
    selectedCity, currentTrack, filteredTracks,
    goBack, selectCity, togglePlay, handlePrev, handleNext,
    toggleShuffle, toggleRepeat, selectTrack, handleProgressClick,
    setVolume, setSearch, showToast, setToast,
  ])

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}

export default PlayerContext
