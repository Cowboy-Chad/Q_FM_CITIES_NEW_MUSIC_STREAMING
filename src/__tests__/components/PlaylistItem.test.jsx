import { render, screen, fireEvent } from '@testing-library/react'
import PlaylistItem from '../../components/playlist/PlaylistItem'

const testTrack = {
  id: 42,
  title: 'Test Song',
  artist: 'Test Artist',
  src: '/test.mp3',
  duration: 180,
}

test('renders track title and artist', () => {
  render(<PlaylistItem track={testTrack} isActive={false} isPlaying={false} onClick={() => {}} />)
  expect(screen.getByText('Test Song')).toBeInTheDocument()
  expect(screen.getByText('Test Artist')).toBeInTheDocument()
})

test('renders formatted duration', () => {
  render(<PlaylistItem track={testTrack} isActive={false} isPlaying={false} onClick={() => {}} />)
  expect(screen.getByText('3:00')).toBeInTheDocument()
})

test('shows play indicator when active and playing', () => {
  render(<PlaylistItem track={testTrack} isActive={true} isPlaying={true} onClick={() => {}} />)
  expect(screen.getByText('\u266A')).toBeInTheDocument()
})

test('hides play indicator when active but not playing', () => {
  render(<PlaylistItem track={testTrack} isActive={true} isPlaying={false} onClick={() => {}} />)
  expect(screen.queryByText('\u266A')).not.toBeInTheDocument()
})

test('hides play indicator when not active', () => {
  render(<PlaylistItem track={testTrack} isActive={false} isPlaying={true} onClick={() => {}} />)
  expect(screen.queryByText('\u266A')).not.toBeInTheDocument()
})

test('has active class when active', () => {
  const { container } = render(<PlaylistItem track={testTrack} isActive={true} isPlaying={false} onClick={() => {}} />)
  const item = container.querySelector('.playlist-item')
  expect(item.className).toContain('active')
})

test('does not have active class when not active', () => {
  const { container } = render(<PlaylistItem track={testTrack} isActive={false} isPlaying={false} onClick={() => {}} />)
  const item = container.querySelector('.playlist-item')
  expect(item.className).not.toContain('active')
})

test('calls onClick with track id when clicked', () => {
  const onClick = vi.fn()
  render(<PlaylistItem track={testTrack} isActive={false} isPlaying={false} onClick={onClick} />)
  fireEvent.click(screen.getByText('Test Song'))
  expect(onClick).toHaveBeenCalledWith(42)
})

test('has data-track-id attribute', () => {
  const { container } = render(<PlaylistItem track={testTrack} isActive={false} isPlaying={false} onClick={() => {}} />)
  const item = container.querySelector('.playlist-item')
  expect(item).toHaveAttribute('data-track-id', '42')
})