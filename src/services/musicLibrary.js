/**
 * Q-FM Cities — Music Library Service
 * Auto-discovers music files via Vite's glob import and builds city/track structures
 */

// Auto-discover all music files using Vite's glob import
// This runs at build time and includes all matching files in the bundle
const musicModules = import.meta.glob('/music/**/*.{mp3,m4a}', { eager: true })

/**
 * Whether to include dummy/placeholder cities for development.
 * Set VITE_INCLUDE_DUMMY_CITIES=true in .env to enable them.
 */
const INCLUDE_DUMMIES = import.meta.env.VITE_INCLUDE_DUMMY_CITIES === 'true'

/**
 * Default fallback duration for tracks (in seconds).
 * The real duration is reported by the Audio element when playing.
 */
const DEFAULT_DURATION = 200

// Build CITIES dynamically from discovered files
function buildCitiesFromFiles() {
  const folderMap = new Map()
  let idCounter = 100

  // Group files by their parent folder
  Object.keys(musicModules).forEach((path) => {
    // Skip non-audio files that might slip through
    // Also skip any malformed paths that end with "/" (directories)
    if (!path.match(/\.(mp3|m4a)$/) || path.endsWith('/')) return

    // Extract folder name (playlist/city name) from path
    // Path format: /music/Folder Name/Track Name.ext or /music/Folder Name/Subfolder/Track.ext
    const parts = path.replace('/music/', '').split('/')
    let folderName = parts[0]
    let fileName = parts[parts.length - 1]

    // Handle nested structure like Gangnam Style/KISS Tribute - Gangnam Style Song/
    if (parts.length > 2) {
      folderName = parts.slice(0, -1).join(' / ')
    }

    if (!folderMap.has(folderName)) {
      folderMap.set(folderName, [])
    }

    // Derive track title from filename (remove extension)
    const title = fileName.replace(/\.(mp3|m4a)$/, '')

    // Try to extract artist from filename patterns like "by Cowboy Chad"
    let artist = 'Q-FM Cities'
    const artistMatch = title.match(/by\s+(.+?)(?:\s*-\s*|$)/i)
    if (artistMatch) {
      artist = artistMatch[1].trim()
    } else if (title.toLowerCase().includes('cowboy chad')) {
      artist = 'Cowboy Chad'
    } else if (folderName.toLowerCase().includes('parody') || folderName.toLowerCase().includes('gaga')) {
      artist = 'Q-FM Parody'
    } else if (folderName.toLowerCase().includes('chantilly')) {
      artist = 'Q-FM Nights'
    }

    folderMap.get(folderName).push({
      id: idCounter++,
      title,
      artist,
      src: path,
      duration: DEFAULT_DURATION, // Default; real duration reported by Audio element when playing
    })
  })

  // Convert map to CITIES array, sorting tracks within each folder
  const cities = Array.from(folderMap.entries()).map(([name, tracks]) => ({
    name,
    cover: '/weather in Victoria, BC.png',
    tracks: tracks.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true })),
  }))

  // Sort cities alphabetically
  cities.sort((a, b) => a.name.localeCompare(b.name))

  return cities
}

const CITIES = buildCitiesFromFiles()

if (typeof console !== 'undefined') {
  console.log('[musicLibrary] Module loaded, CITIES count:', CITIES.length)
}

export function getCities() {
  return CITIES
}

export function getCity(index) {
  return CITIES[index] || null
}

export function getCityIndex(cityName) {
  return CITIES.findIndex(c => c.name === cityName)
}

export function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return m + ':' + (s < 10 ? '0' + s : s)
}
