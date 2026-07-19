import { formatTime } from '../../services/musicLibrary'

describe('formatTime', () => {
  test('formats seconds to m:ss format', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(30)).toBe('0:30')
    expect(formatTime(60)).toBe('1:00')
    expect(formatTime(90)).toBe('1:30')
    expect(formatTime(120)).toBe('2:00')
    expect(formatTime(3599)).toBe('59:59')
  })

  test('handles null, undefined, and NaN', () => {
    expect(formatTime(null)).toBe('0:00')
    expect(formatTime(undefined)).toBe('0:00')
    expect(formatTime(NaN)).toBe('0:00')
  })

  test('handles zero', () => {
    expect(formatTime(0)).toBe('0:00')
  })

  test('handles decimal values', () => {
    expect(formatTime(90.5)).toBe('1:30')
    expect(formatTime(1.9)).toBe('0:01')
  })

  test('pads seconds with leading zero', () => {
    expect(formatTime(5)).toBe('0:05')
    expect(formatTime(65)).toBe('1:05')
  })

  test('handles large values', () => {
    expect(formatTime(7200)).toBe('120:00')
  })
})