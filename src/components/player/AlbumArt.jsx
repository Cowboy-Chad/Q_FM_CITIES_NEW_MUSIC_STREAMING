import React, { useState } from 'react'

export default function AlbumArt({ src, alt }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <img
        className="album-art"
        src={src}
        alt={alt || 'Album Art'}
        loading="lazy"
        onClick={() => setExpanded(true)}
        onError={(e) => { e.target.style.display = 'none' }}
      />

      {expanded && (
        <div className="image-overlay" onClick={() => setExpanded(false)}>
          <div className="image-overlay-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={src}
              alt={alt ? alt + ' Expanded' : 'Album Art Expanded'}
              className="image-expanded"
              loading="lazy"
            />
            <button className="image-overlay-close" onClick={() => setExpanded(false)}>&times;</button>
          </div>
        </div>
      )}
    </>
  )
}