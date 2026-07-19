import React, { useState, useCallback, useRef } from 'react'
import CityCard from './CityCard'
import { getCities } from '../../services/musicLibrary'
import { VISIBLE_COUNT_INCREMENT } from '../../lib/constants'

export default function CitiesGrid({ onCitySelect }) {
  const [visibleCount, setVisibleCount] = useState(12)
  const gridRef = useRef(null)
  const cities = getCities()

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setVisibleCount(prev => Math.min(prev + VISIBLE_COUNT_INCREMENT, cities.length))
    }
  }, [cities.length])

  return (
    <div
      className="cities-grid"
      ref={gridRef}
      onScroll={handleScroll}
      style={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      {cities.slice(0, visibleCount).map((city, index) => (
        <CityCard key={index} city={city} index={index} onClick={onCitySelect} />
      ))}
    </div>
  )
}