import { render, screen } from '@testing-library/react'
import CitiesGrid from '../../components/cities/CitiesGrid'

// getCities() returns dynamically-discovered cities from the music/ directory
// The test environment has the music/ folder available, so real cities will be loaded

test('renders city cards', () => {
  const onSelect = vi.fn()
  render(<CitiesGrid onCitySelect={onSelect} />)

  // At least one city card should be rendered
  const cityCards = document.querySelectorAll('.city-card')
  expect(cityCards.length).toBeGreaterThan(0)
})

test('displays city names', () => {
  const onSelect = vi.fn()
  render(<CitiesGrid onCitySelect={onSelect} />)

  // Common city names from the music directory
  const cityNames = document.querySelectorAll('.city-name')
  expect(cityNames.length).toBeGreaterThan(0)
})

test('renders grid container with scroll', () => {
  const onSelect = vi.fn()
  const { container } = render(<CitiesGrid onCitySelect={onSelect} />)

  const grid = container.querySelector('.cities-grid')
  expect(grid).toBeInTheDocument()
  expect(grid.style.maxHeight).toBe('70vh')
  expect(grid.style.overflowY).toBe('auto')
})

test('shows track counts for each city', () => {
  const onSelect = vi.fn()
  render(<CitiesGrid onCitySelect={onSelect} />)

  const trackCounts = document.querySelectorAll('.city-track-count')
  expect(trackCounts.length).toBeGreaterThan(0)
  trackCounts.forEach(el => {
    expect(el.textContent).toMatch(/\d+ tracks?/)
  })
})