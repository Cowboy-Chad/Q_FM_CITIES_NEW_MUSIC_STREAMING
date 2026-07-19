import { render, screen, fireEvent } from '@testing-library/react'
import VolumeControl from '../../components/player/VolumeControl'

test('renders label and volume value', () => {
  render(<VolumeControl volume={0.7} onVolumeChange={() => {}} />)
  expect(screen.getByText('Vol')).toBeInTheDocument()
  expect(screen.getByText('70%')).toBeInTheDocument()
})

test('renders 0% volume correctly', () => {
  render(<VolumeControl volume={0} onVolumeChange={() => {}} />)
  expect(screen.getByText('0%')).toBeInTheDocument()
})

test('renders 100% volume correctly', () => {
  render(<VolumeControl volume={1} onVolumeChange={() => {}} />)
  expect(screen.getByText('100%')).toBeInTheDocument()
})

test('has range input with correct min/max/step', () => {
  render(<VolumeControl volume={0.5} onVolumeChange={() => {}} />)
  const slider = screen.getByRole('slider')
  expect(slider).toHaveAttribute('min', '0')
  expect(slider).toHaveAttribute('max', '1')
  expect(slider).toHaveAttribute('step', '0.05')
  expect(slider).toHaveValue('0.5')
})

test('calls onVolumeChange when slider changes', () => {
  const onVolumeChange = vi.fn()
  render(<VolumeControl volume={0.5} onVolumeChange={onVolumeChange} />)
  const slider = screen.getByRole('slider')
  fireEvent.change(slider, { target: { value: '0.8' } })
  expect(onVolumeChange).toHaveBeenCalledWith(0.8)
})