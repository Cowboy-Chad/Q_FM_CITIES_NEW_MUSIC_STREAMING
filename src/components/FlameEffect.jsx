import React from 'react'

const PARTICLES = Array.from({ length: 10 }, (_, i) => i)

export default function FlameEffect({ children }) {
  return (
    <div className="flame-container">
      <div className="flame-particles">
        {PARTICLES.map(i => (
          <div
            key={i}
            className={'flame-particle flame-particle-' + i}
          />
        ))}
      </div>
      <div className="flame-glow" />
      {children}
    </div>
  )
}