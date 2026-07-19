import { render, screen, fireEvent } from '@testing-library/react'
import AppHeader from '../../components/layout/AppHeader'

test('renders title and subtitle', () => {
  render(<AppHeader title="Q-FM Cities" subtitle="The Sound of The Open Range" isSubscribed={false} onSubscribeClick={() => {}} />)
  expect(screen.getByText('Q-FM Cities')).toBeInTheDocument()
  expect(screen.getByText('The Sound of The Open Range')).toBeInTheDocument()
})

test('renders Subscribe button when not subscribed', () => {
  render(<AppHeader title="Test" subtitle="Test" isSubscribed={false} onSubscribeClick={() => {}} />)
  expect(screen.getByText('Subscribe')).toBeInTheDocument()
  expect(screen.queryByText('Premium')).not.toBeInTheDocument()
})

test('renders Premium button when subscribed', () => {
  render(<AppHeader title="Test" subtitle="Test" isSubscribed={true} onSubscribeClick={() => {}} />)
  expect(screen.getByText('Premium')).toBeInTheDocument()
  expect(screen.queryByText('Subscribe')).not.toBeInTheDocument()
})

test('calls onSubscribeClick when button clicked', () => {
  const onClick = vi.fn()
  render(<AppHeader title="Test" subtitle="Test" isSubscribed={false} onSubscribeClick={onClick} />)
  fireEvent.click(screen.getByText('Subscribe'))
  expect(onClick).toHaveBeenCalledTimes(1)
})

test('has subscribed class when isSubscribed is true', () => {
  render(<AppHeader title="Test" subtitle="Test" isSubscribed={true} onSubscribeClick={() => {}} />)
  const btn = screen.getByText('Premium').closest('button')
  expect(btn.className).toContain('subscribed')
})