import React, { memo } from 'react'
import { formatTime } from '../../services/musicLibrary'

const ProgressBar = memo(function ProgressBar({ currentTime, duration, onSeek }) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  function handleClick(e) {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const newTime = ratio * duration
    if (onSeek) onSeek(newTime)
  }

  return (
    <div className="progress-container">
      <span className="time-display">{formatTime(currentTime)}</span>
      <div className="progress-bar" onClick={handleClick}>
        <div className="progress-fill" style={{ width: progress + '%' }} />
      </div>
      <span className="time-display">{formatTime(duration)}</span>
    </div>
  )
})

export default ProgressBar