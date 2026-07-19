import React from 'react'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-container">
      <span className="search-icon">{'\u2315'}</span>
      <input
        type="text"
        placeholder="Search tracks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}