import React, { memo } from 'react'

const CityCard = memo(function CityCard({ city, index, onClick }) {
  return (
    <div className="city-card" onClick={() => onClick(index)}>
      <img src={city.cover} alt={city.name} className="city-cover" loading="lazy" />
      <div className="city-name">{city.name}</div>
      <div className="city-track-count">{city.tracks.length} {city.tracks.length === 1 ? 'track' : 'tracks'}</div>
    </div>
  )
})

export default CityCard