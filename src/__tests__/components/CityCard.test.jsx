import { render, screen, fireEvent } from '@testing-library/react'
import CityCard from '../../components/cities/CityCard'

test('renders city name and track count', () => {
  const city = { name: 'Test City', cover: '/test.png', tracks: [{ id: 1 }, { id: 2 }] }
  render(<CityCard city={city} index={0} onClick={() => {}} />)
  expect(screen.getByText('Test City')).toBeInTheDocument()
  expect(screen.getByText('2 tracks')).toBeInTheDocument()
})

test('renders single track count correctly', () => {
  const city = { name: 'Solo City', cover: '/test.png', tracks: [{ id: 1 }] }
  render(<CityCard city={city} index={0} onClick={() => {}} />)
  expect(screen.getByText('1 track')).toBeInTheDocument()
})

test('calls onClick with index when clicked', () => {
  const onClick = vi.fn()
  const city = { name: 'Click City', cover: '/test.png', tracks: [] }
  render(<CityCard city={city} index={3} onClick={onClick} />)
  fireEvent.click(screen.getByText('Click City'))
  expect(onClick).toHaveBeenCalledWith(3)
})

test('renders city cover image with correct alt text', () => {
  const city = { name: 'Image City', cover: '/custom-cover.png', tracks: [] }
  render(<CityCard city={city} index={0} onClick={() => {}} />)
  const img = screen.getByAltText('Image City')
  expect(img).toBeInTheDocument()
  expect(img).toHaveAttribute('src', '/custom-cover.png')
})