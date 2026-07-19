import React, { memo } from 'react'

const PlayerControls = memo(function PlayerControls({
  isPlaying,
  isShuffled,
  repeatMode,
  isFavorite,
  onTogglePlay,
  onPrev,
  onNext,
  onToggleShuffle,
  onToggleRepeat,
  onToggleFavorite,
}) {
  return (
    <>
      <div className="controls">
        <button className="btn-secondary" onClick={onPrev}>&#x23EE;</button>
        <button className="play-btn" onClick={onTogglePlay}>
          {isPlaying ? '\u23F8' : '\u25B6'}
        </button>
        <button className="btn-secondary" onClick={onNext}>&#x23ED;</button>
      </div>

      <div className="extra-controls">
        <button className={'btn-secondary' + (isShuffled ? ' active' : '')} onClick={onToggleShuffle}>&#x1F500;</button>
        <button className={'btn-secondary' + (repeatMode !== 'off' ? ' active' : '')} onClick={onToggleRepeat}>
          {repeatMode === 'one' ? '\uD83D\uDD02' : '\uD83D\uDD01'}
        </button>
        <button className={'btn-secondary' + (isFavorite ? ' active' : '')} onClick={onToggleFavorite}>&#x2764;</button>
      </div>
    </>
  )
})

export default PlayerControls