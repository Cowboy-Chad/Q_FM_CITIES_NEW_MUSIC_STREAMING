import { render, screen, fireEvent } from '@testing-library/react'
import ProgressBar from '../../components/player/ProgressBar'

test('renders current time and duration', () => {
  render(<ProgressBar currentTime={60} duration={180} onSeek={() => {}} />)
  expect(screen.getByText('1:00')).toBeInTheDocument()
  expect(screen.getByText('3:00')).toBeInTheDocument()
})

test('renders progress fill with correct width', () => {
  const { container } = render(<ProgressBar currentTime={30} duration={120} onSeek={() => {}} />)
  const fill = container.querySelector('.progress-fill')
  expect(fill).toHaveStyle('width: 25%')
})

test('renders 0% progress at start', () => {
  const { container } = render(<ProgressBar currentTime={0} duration={120} onSeek={() => {}} />)
  const fill = container.querySelector('.progress-fill')
  expect(fill).toHaveStyle('width: 0%')
})

test('renders 100% progress at end', () => {
  const { container } = render(<ProgressBar currentTime={120} duration={120} onSeek={() => {}} />)
  const fill = container.querySelector('.progress-fill')
  expect(fill).toHaveStyle('width: 100%')
})

test('calls onSeek with correct time on click', () => {
  const onSeek = vi.fn()
  const { container } = render(<ProgressBar currentTime={0} duration={200} onSeek={onSeek} />)
  const bar = container.querySelector('.progress-bar')
  // Mock the click at 50% position
  Object.defineProperty(bar, 'getBoundingClientRect', {
    value: () => ({ left: 0, width: 200 }),
  })
  fireEvent.click(bar, { clientX: 100 })
  expect(onSeek).toHaveBeenCalledWith(100)
})

test('does not call onSeek when duration is 0', () => {
  const onSeek = vi.fn()
  const { container } = render(<ProgressBar currentTime={0} duration={0} onSeek={onSeek} />)
  const bar = container.querySelector('.progress-bar')
  fireEvent.click(bar)
  expect(onSeek).not.toHaveBeenCalled()
})

test('shows 0:00 for zero values', () => {
  render(<ProgressBar currentTime={0} duration={0} onSeek={() => {}} />)
  const times = screen.getAllByText('0:00')
  expect(times).toHaveLength(2)
})