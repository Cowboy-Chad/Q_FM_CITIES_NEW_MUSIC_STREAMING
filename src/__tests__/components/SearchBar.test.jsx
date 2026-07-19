import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '../../components/playlist/SearchBar'

test('renders search input with placeholder', () => {
  render(<SearchBar value="" onChange={() => {}} />)
  const input = screen.getByPlaceholderText('Search tracks...')
  expect(input).toBeInTheDocument()
})

test('displays the current value', () => {
  render(<SearchBar value="test query" onChange={() => {}} />)
  const input = screen.getByPlaceholderText('Search tracks...')
  expect(input).toHaveValue('test query')
})

test('calls onChange when input changes', () => {
  const onChange = vi.fn()
  render(<SearchBar value="" onChange={onChange} />)
  const input = screen.getByPlaceholderText('Search tracks...')
  fireEvent.change(input, { target: { value: 'new search' } })
  expect(onChange).toHaveBeenCalledWith('new search')
})