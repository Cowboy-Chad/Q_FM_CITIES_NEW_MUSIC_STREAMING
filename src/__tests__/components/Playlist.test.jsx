import { render, screen, fireEvent } from '@testing-library/react'
import Playlist from '../../components/playlist/Playlist'

const mockTracks = [
  { id: 1, title: 'Track One', artist: 'Artist A', src: '/a.mp3', duration: 180 },
  { id: 2, title: 'Track Two', artist: 'Artist B', src: '/b.mp3', duration: 200 },
  { id: 3, title: 'Different', artist: 'Artist C', src: '/c.mp3', duration: 150 },
]

test('renders all tracks', () => {
  render(<Playlist tracks={mockTracks} currentTrackId={null} isPlaying={false} search="" onSearchChange={() => {}} onTrackSelect={() => {}} />)
  expect(screen.getByText('Track One')).toBeInTheDocument()
  expect(screen.getByText('Track Two')).toBeInTheDocument()
  expect(screen.getByText('Different')).toBeInTheDocument()
})

test('shows correct track count', () => {
  render(<Playlist tracks={mockTracks} currentTrackId={null} isPlaying={false} search="" onSearchChange={() => {}} onTrackSelect={() => {}} />)
  expect(screen.getByText('3 tracks')).toBeInTheDocument()
})

test('filters tracks by title search', () => {
  render(<Playlist tracks={mockTracks} currentTrackId={null} isPlaying={false} search="Track" onSearchChange={() => {}} onTrackSelect={() => {}} />)
  expect(screen.getByText('Track One')).toBeInTheDocument()
  expect(screen.getByText('Track Two')).toBeInTheDocument()
  expect(screen.queryByText('Different')).not.toBeInTheDocument()
})

test('filters tracks by artist search', () => {
  render(<Playlist tracks={mockTracks} currentTrackId={null} isPlaying={false} search="Artist B" onSearchChange={() => {}} onTrackSelect={() => {}} />)
  expect(screen.getByText('Track Two')).toBeInTheDocument()
  expect(screen.queryByText('Track One')).not.toBeInTheDocument()
  expect(screen.queryByText('Different')).not.toBeInTheDocument()
})

test('shows empty state when no tracks match', () => {
  render(<Playlist tracks={mockTracks} currentTrackId={null} isPlaying={false} search="zzzzz" onSearchChange={() => {}} onTrackSelect={() => {}} />)
  expect(screen.getByText('No tracks match your search.')).toBeInTheDocument()
})

test('calls onTrackSelect when track is clicked', () => {
  const onSelect = vi.fn()
  render(<Playlist tracks={mockTracks} currentTrackId={null} isPlaying={false} search="" onSearchChange={() => {}} onTrackSelect={onSelect} />)
  fireEvent.click(screen.getByText('Track One'))
  expect(onSelect).toHaveBeenCalledWith(1)
})

test('renders SearchBar component', () => {
  render(<Playlist tracks={mockTracks} currentTrackId={null} isPlaying={false} search="" onSearchChange={() => {}} onTrackSelect={() => {}} />)
  expect(screen.getByPlaceholderText('Search tracks...')).toBeInTheDocument()
})