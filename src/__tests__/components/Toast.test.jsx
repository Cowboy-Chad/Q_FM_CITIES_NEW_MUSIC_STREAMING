import { render, screen } from '@testing-library/react'
import Toast from '../../components/layout/Toast'

test('renders toast message when provided', () => {
  render(<Toast message="Hello World" />)
  expect(screen.getByText('Hello World')).toBeInTheDocument()
})

test('has show class when message is provided', () => {
  const { container } = render(<Toast message="Visible" />)
  const toast = container.querySelector('.toast')
  expect(toast.className).toContain('show')
})

test('does not have show class when message is empty', () => {
  const { container } = render(<Toast message="" />)
  const toast = container.querySelector('.toast')
  expect(toast.className).not.toContain('show')
})

test('does not have show class when message is null', () => {
  const { container } = render(<Toast message={null} />)
  const toast = container.querySelector('.toast')
  expect(toast.className).not.toContain('show')
})

test('renders empty div when no message', () => {
  const { container } = render(<Toast message="" />)
  const toast = container.querySelector('.toast')
  expect(toast).toBeInTheDocument()
  expect(toast.textContent).toBe('')
})