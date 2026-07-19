/**
 * Q-FM Cities — TypeScript Type Definitions
 * 
 * These types describe the core data structures used throughout the application.
 * They can be used incrementally as files are migrated from JSX to TSX.
 */

/** A single audio track within a city/playlist */
export interface Track {
  id: number
  title: string
  artist: string
  src: string
  duration: number
}

/** A city (playlist) containing tracks */
export interface City {
  name: string
  cover: string
  tracks: Track[]
}

/** Available theme names */
export type ThemeName = 'mediumGray' | 'lightGray' | 'richBlue' | 'limeGreen' | 'brightPink'

/** Repeat mode for the audio player */
export type RepeatMode = 'off' | 'all' | 'one'

/** Sync status for cloud operations */
export type SyncStatus = 'idle' | 'syncing' | 'error'

/** Subscription plan information */
export interface SubscriptionPlan {
  name: string
  price: number
  currency: string
  features: string[]
}

/** Toast notification state */
export interface ToastState {
  message: string | null
  visible: boolean
}

/** Player context state */
export interface PlayerState {
  selectedCityIndex: number | null
  currentTrackIndex: number
  isPlaying: boolean
  volume: number
  currentTime: number
  isShuffled: boolean
  repeatMode: RepeatMode
  search: string
  toast: string | null
}

/** Player context actions */
export interface PlayerActions {
  play: () => void
  pause: () => void
  togglePlay: () => void
  next: () => void
  prev: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  selectCity: (index: number) => void
  selectTrack: (index: number) => void
  setSearch: (query: string) => void
  showToast: (message: string) => void
}

/** Combined player context value */
export interface PlayerContextValue extends PlayerState {
  actions: PlayerActions
  selectedCity: City | null
  currentTrack: Track | null
  filteredTracks: Track[]
}

/** Auth context state */
export interface AuthState {
  user: import('@supabase/supabase-js').User | null
  session: import('@supabase/supabase-js').Session | null
  loading: boolean
}

/** Auth context actions */
export interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

/** Sync context state */
export interface SyncState {
  favorites: number[]
  syncStatus: SyncStatus
  uploadProgress: number | null
}

/** Sync context actions */
export interface SyncActions {
  toggleFavorite: (trackId: number) => Promise<void>
  isFavorite: (trackId: number) => boolean
  syncNow: () => Promise<void>
}
