import React, { useRef, useEffect } from 'react'
import SearchBar from './SearchBar'
import PlaylistItem from './PlaylistItem'

export default function Playlist({
  tracks,
  currentTrackId,
  isPlaying,
  search,
  onSearchChange,
  onTrackSelect,
}) {
  const playlistRef = useRef(null)

  const filteredTracks = tracks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.artist.toLowerCase().includes(search.toLowerCase())
  )

  // Auto-scroll to keep the active track visible
  useEffect(() => {
    if (!playlistRef.current || !currentTrackId) return
    const activeItem = playlistRef.current.querySelector(
      `.playlist-item[data-track-id="${currentTrackId}"]`
    )
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [currentTrackId, tracks])

  return (
    <div className="playlist-section">
      <div className="playlist-header">
        <h3>Tracks</h3>
        <span className="count">{filteredTracks.length} tracks</span>
      </div>

      <SearchBar value={search} onChange={onSearchChange} />

      <div className="playlist" ref={playlistRef}>
        {filteredTracks.length === 0 ? (
          <div className="empty-state">
            <p>No tracks match your search.</p>
          </div>
        ) : (
          filteredTracks.map(track => (
            <PlaylistItem
              key={track.id}
              track={track}
              isActive={track.id === currentTrackId}
              isPlaying={isPlaying}
              onClick={onTrackSelect}
            />
          ))
        )}
      </div>
    </div>
  )
}