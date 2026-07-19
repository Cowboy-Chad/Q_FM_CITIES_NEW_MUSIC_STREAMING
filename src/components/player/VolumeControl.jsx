import React, { memo } from 'react'

const VolumeControl = memo(function VolumeControl({ volume, onVolumeChange }) {
  return (
    <div className="volume-container">
      <label>Vol</label>
      <input
        type="range"
        className="volume-slider"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
      />
      <span className="volume-value">{Math.round(volume * 100)}%</span>
    </div>
  )
})

export default VolumeControl