import React, { memo } from 'react'
import { formatTime } from '../../services/musicLibrary'

const PlaylistItem = memo(function PlaylistItem({ track, isActive, isPlaying, onClick }) {
  return (
    <div
      data-track-id={track.id}
      className={'playlist-item' + (isActive ? ' active' : '')}
      onClick={() => onClick(track.id)}
    >
      <div className="track-info">
        <div className="track-title">{track.title}</div>
        <div className="track-artist">{track.artist}</div>
      </div>
      {isActive && isPlaying && (
        <span className="play-indicator">{'\u266A'}</span>
      )}
      <span className="track-duration">{formatTime(track.duration)}</span>
    </div>
  )
})

export default PlaylistItem