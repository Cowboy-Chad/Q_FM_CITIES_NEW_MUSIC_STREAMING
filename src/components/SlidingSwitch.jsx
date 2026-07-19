import React from 'react'

const THEMES = ['mediumGray', 'lightGray', 'richBlue', 'limeGreen', 'brightPink']

const DOT_COLORS = {
  mediumGray: '#808080',
  lightGray:  '#d3d3d3',
  richBlue:   '#1a73e8',
  limeGreen:  '#32cd32',
  brightPink: '#ff1493',
}

export default function SlidingSwitch({ activeTheme, onThemeChange }) {
  const activeIndex = THEMES.indexOf(activeTheme)

  function handlePress() {
    const nextIndex = (activeIndex + 1) % THEMES.length
    onThemeChange(THEMES[nextIndex])
  }

  return (
    <button
      className="theme-btn"
      onClick={handlePress}
      title={'Theme: ' + activeTheme + ' (click to cycle)'}
      aria-label="Cycle color theme"
    >
      <span
        className="theme-dot"
        style={{ background: DOT_COLORS[activeTheme] || DOT_COLORS.mediumGray }}
      />
    </button>
  )
}