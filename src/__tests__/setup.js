import '@testing-library/jest-dom'

// Mock Audio constructor for jsdom environment
if (typeof Audio === 'undefined') {
  global.Audio = class MockAudio {
    constructor() {
      this.currentTime = 0
      this.duration = 0
      this.volume = 1
      this.src = ''
      this.listeners = {}
    }
    addEventListener(event, handler) {
      this.listeners[event] = handler
    }
    removeEventListener(event, handler) {
      delete this.listeners[event]
    }
    load() {}
    play() { return Promise.resolve() }
    pause() {}
  }
}
