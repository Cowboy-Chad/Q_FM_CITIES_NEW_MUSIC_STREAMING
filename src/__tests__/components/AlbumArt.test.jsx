import { render, screen, fireEvent } from '@testing-library/react'
import AlbumArt from '../../components/player/AlbumArt'

test('renders image with correct src and alt', () => {
  render(<AlbumArt src="/test.png" alt="Test City" />)
  const img = screen.getByAltText('Test City')
  expect(img).toBeInTheDocument()
  expect(img).toHaveAttribute('src', '/test.png')
})

test('uses default alt when none provided', () => {
  render(<AlbumArt src="/test.png" />)
  const img = screen.getByAltText('Album Art')
  expect(img).toBeInTheDocument()
})

test('expands on click', () => {
  render(<AlbumArt src="/test.png" alt="Test City" />)
  const img = screen.getByAltText('Test City')
  fireEvent.click(img)

  const expandedImg = screen.getByAltText('Test City Expanded')
  expect(expandedImg).toBeInTheDocument()
  expect(screen.getByText('\u00D7')).toBeInTheDocument()
})

test('closes when overlay is clicked', () => {
  render(<AlbumArt src="/test.png" alt="Test City" />)
  fireEvent.click(screen.getByAltText('Test City'))

  const overlay = document.querySelector('.image-overlay')
  fireEvent.click(overlay)

  expect(screen.queryByAltText('Test City Expanded')).not.toBeInTheDocument()
})

test('does not close when overlay content is clicked', () => {
  render(<AlbumArt src="/test.png" alt="Test City" />)
  fireEvent.click(screen.getByAltText('Test City'))

  const overlayContent = document.querySelector('.image-overlay-content')
  fireEvent.click(overlayContent)

  expect(screen.getByAltText('Test City Expanded')).toBeInTheDocument()
})