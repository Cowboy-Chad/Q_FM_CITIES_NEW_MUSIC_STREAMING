import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePlayer } from '../../context/PlayerContext'
import { useAuth } from '../../context/AuthContext'
import { useSync } from '../../context/SyncContext'
import { getCities } from '../../services/musicLibrary'
import FlameEffect from '../FlameEffect'
import SlidingSwitch from '../SlidingSwitch'
import AlbumArt from '../player/AlbumArt'
import ProgressBar from '../player/ProgressBar'
import PlayerControls from '../player/PlayerControls'
import VolumeControl from '../player/VolumeControl'
import Playlist from '../playlist/Playlist'
import SubscriptionPage from '../SubscriptionPage'
import AppFooter from '../layout/AppFooter'
import Toast from '../layout/Toast'

const CITIES = getCities()

export default function CityPlayerPage({
  activeTheme,
  showSubscription,
  isSubscribed,
  onThemeChange,
  setShowSubscription,
  handleSubscriptionSuccess,
}) {
  const { cityId } = useParams()
  const navigate = useNavigate()
  const themeClass = 'theme-' + activeTheme

  // Player context
  const {
    currentTrackIndex, isPlaying, volume, search, currentTime,
    isShuffled, repeatMode, toast, currentTrack, filteredTracks,
    togglePlay, handlePrev, handleNext, toggleShuffle,
    toggleRepeat, selectTrack, handleProgressClick, setVolume,
    setSearch, showToast, selectCity, goBack,
  } = usePlayer()

  // Auth and sync contexts
  const { user, isAuthenticated } = useAuth()
  const { toggleFavorite, isFavorite, syncStatus } = useSync()

  // Parse city index from URL params
  const cityIndex = parseInt(cityId, 10)
  const city = CITIES[cityIndex] || null

  // Set the city in PlayerContext when navigating directly to a URL
  useEffect(() => {
    if (city && (cityIndex !== null)) {
      selectCity(cityIndex)
    }
  }, [cityIndex])

  const isFav = currentTrack ? isFavorite(currentTrack.id) : false

  function handleGoBack() {
    goBack()
    navigate('/')
  }

  if (!city) {
    return (
      <div className={'app-container' + (themeClass ? ' ' + themeClass : '')}>
        <div className="error-state">
          <h2>City not found</h2>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Back to Cities
          </button>
        </div>
      </div>
    )
  }

  const displayTrack = currentTrack || city.tracks[0]

  return (
    <div className={'app-container' + (themeClass ? ' ' + themeClass : '')}>
      <FlameEffect>
        <button
          className="station-icon back-btn-icon"
          onClick={handleGoBack}
          aria-label="Back to cities"
          title="Back to cities"
        >
          <svg width="24" height="36" viewBox="0 0 24 36">
            <rect className="tower-base" x="4" y="30" width="16" height="4" rx="1" />
            <rect className="tower-body" x="10" y="8" width="4" height="22" rx="1" />
            <rect className="tower-bar" x="2" y="24" width="20" height="3" rx="1" />
            <rect className="tower-bar" x="4" y="18" width="16" height="3" rx="1" />
            <rect className="tower-bar" x="6" y="12" width="12" height="3" rx="1" />
            <rect className="tower-antenna" x="11" y="0" width="2" height="8" rx="1" />
          </svg>
        </button>
      </FlameEffect>

      {/* Sync status indicator */}
      {syncStatus === 'syncing' && (
        <div className="sync-indicator">Syncing...</div>
      )}

      <SlidingSwitch activeTheme={activeTheme} onThemeChange={onThemeChange} />

      <div className="app-header">
        <h1>{city.name}</h1>
        <p>The Sound of The Open Range</p>
      </div>

      {/* Auth status */}
      {isAuthenticated && (
        <div className="auth-status">
          Signed in as {user.email}
        </div>
      )}

      <AlbumArt
        src={city.cover}
        alt={city.name + ' Album Art'}
      />

      <div className="now-playing">
        <h2>{displayTrack.title}</h2>
        <p className="artist">{displayTrack.artist}</p>
      </div>

      <ProgressBar
        currentTime={currentTime}
        duration={displayTrack.duration}
        onSeek={handleProgressClick}
      />

      <PlayerControls
        isPlaying={isPlaying}
        isShuffled={isShuffled}
        repeatMode={repeatMode}
        isFavorite={isFav}
        onTogglePlay={togglePlay}
        onPrev={handlePrev}
        onNext={handleNext}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
        onToggleFavorite={() => toggleFavorite(displayTrack.id)}
      />

      <VolumeControl
        volume={volume}
        onVolumeChange={setVolume}
      />

      <Playlist
        tracks={city.tracks}
        currentTrackId={displayTrack.id}
        isPlaying={isPlaying}
        search={search}
        onSearchChange={setSearch}
        onTrackSelect={selectTrack}
      />

      <div className="modal-buttons">
        <button
          className="btn btn-secondary"
          onClick={() => showToast('Tuning into ' + city.name + ' live stream...')}
        >
          {city.name} Live Stream
          <span className="badge">LIVE</span>
        </button>
      </div>

      {showSubscription && (
        <SubscriptionPage
          onClose={() => setShowSubscription(false)}
          onSubscribe={handleSubscriptionSuccess}
        />
      )}

      <AppFooter />
      <Toast message={toast} />
    </div>
  )
}