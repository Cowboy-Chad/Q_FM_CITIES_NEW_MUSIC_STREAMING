import { render, screen, fireEvent } from '@testing-library/react'
import PlayerControls from '../../components/player/PlayerControls'

const defaultProps = {
  isPlaying: false,
  isShuffled: false,
  repeatMode: 'off',
  isFavorite: false,
  isSubscribed: false,
  onTogglePlay: vi.fn(),
  onPrev: vi.fn(),
  onNext: vi.fn(),
  onToggleShuffle: vi.fn(),
  onToggleRepeat: vi.fn(),
  onToggleFavorite: vi.fn(),
  onSubscribeClick: vi.fn(),
}

test('renders all control buttons', () => {
  render(<PlayerControls {...defaultProps} />)
  // Play button
  expect(screen.getByText('\u25B6')).toBeInTheDocument()
  // Previous
  expect(screen.getByText('\u23EE')).toBeInTheDocument()
  // Next
  expect(screen.getByText('\u23ED')).toBeInTheDocument()
  // Subscribe button
  expect(screen.getByText('Sub')).toBeInTheDocument()
})

test('shows pause icon when playing', () => {
  render(<PlayerControls {...defaultProps} isPlaying={true} />)
  expect(screen.getByText('\u23F8')).toBeInTheDocument()
  expect(screen.queryByText('\u25B6')).not.toBeInTheDocument()
})

test('shows premium label when subscribed', () => {
  render(<PlayerControls {...defaultProps} isSubscribed={true} />)
  expect(screen.getByText('Premium')).toBeInTheDocument()
  expect(screen.queryByText('Sub')).not.toBeInTheDocument()
})

test('calls onTogglePlay when play button clicked', () => {
  const onTogglePlay = vi.fn()
  render(<PlayerControls {...defaultProps} onTogglePlay={onTogglePlay} />)
  fireEvent.click(screen.getByText('\u25B6'))
  expect(onTogglePlay).toHaveBeenCalledOnce()
})

test('calls onPrev when prev button clicked', () => {
  const onPrev = vi.fn()
  render(<PlayerControls {...defaultProps} onPrev={onPrev} />)
  fireEvent.click(screen.getByText('\u23EE'))
  expect(onPrev).toHaveBeenCalledOnce()
})

test('calls onNext when next button clicked', () => {
  const onNext = vi.fn()
  render(<PlayerControls {...defaultProps} onNext={onNext} />)
  fireEvent.click(screen.getByText('\u23ED'))
  expect(onNext).toHaveBeenCalledOnce()
})

test('calls onToggleShuffle when shuffle clicked', () => {
  const onToggleShuffle = vi.fn()
  render(<PlayerControls {...defaultProps} onToggleShuffle={onToggleShuffle} />)
  fireEvent.click(screen.getByText('\uD83D\uDD00'))
  expect(onToggleShuffle).toHaveBeenCalledOnce()
})

test('calls onToggleRepeat when repeat clicked', () => {
  const onToggleRepeat = vi.fn()
  render(<PlayerControls {...defaultProps} onToggleRepeat={onToggleRepeat} />)
  fireEvent.click(screen.getByText('\uD83D\uDD01'))
  expect(onToggleRepeat).toHaveBeenCalledOnce()
})

test('calls onToggleFavorite when favorite clicked', () => {
  const onToggleFavorite = vi.fn()
  render(<PlayerControls {...defaultProps} onToggleFavorite={onToggleFavorite} />)
  fireEvent.click(screen.getByText('\u2764'))
  expect(onToggleFavorite).toHaveBeenCalledOnce()
})

test('calls onSubscribeClick when subscribe clicked', () => {
  const onSubscribeClick = vi.fn()
  render(<PlayerControls {...defaultProps} onSubscribeClick={onSubscribeClick} />)
  fireEvent.click(screen.getByText('Sub'))
  expect(onSubscribeClick).toHaveBeenCalledOnce()
})

test('shows shuffle active state', () => {
  render(<PlayerControls {...defaultProps} isShuffled={true} />)
  const shuffleBtn = screen.getByText('\uD83D\uDD00').closest('button')
  expect(shuffleBtn.className).toContain('active')
})

test('shows repeat active state', () => {
  render(<PlayerControls {...defaultProps} repeatMode={'all'} />)
  const repeatBtn = screen.getByText('\uD83D\uDD01').closest('button')
  expect(repeatBtn.className).toContain('active')
})

test('shows repeat-one icon when repeatMode is one', () => {
  render(<PlayerControls {...defaultProps} repeatMode={'one'} />)
  expect(screen.getByText('\uD83D\uDD02')).toBeInTheDocument()
  expect(screen.queryByText('\uD83D\uDD01')).not.toBeInTheDocument()
})