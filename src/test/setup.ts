// Test setup file
import { vi } from 'vitest'

// Mock canvas
const mockCanvas = {
  getContext: vi.fn(() => ({
    fillRect: vi.fn(),
    fillText: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    globalAlpha: 1,
    fillStyle: '',
    font: '',
    textAlign: '',
    textBaseline: '',
    imageSmoothingEnabled: true,
  })),
  width: 800,
  height: 600,
  style: {},
}

// Mock HTMLCanvasElement
Object.defineProperty(global, 'HTMLCanvasElement', {
  value: class HTMLCanvasElement {
    getContext(type: string) {
      return mockCanvas.getContext(type)
    }
    width = 800
    height = 600
    style = {}
  },
})

// Mock document
Object.defineProperty(global, 'document', {
  value: {
    createElement: vi.fn((tag: string) => {
      if (tag === 'canvas') {
        return mockCanvas
      }
      return {}
    }),
  },
})

// Mock window
Object.defineProperty(global, 'window', {
  value: {
    devicePixelRatio: 1,
  },
})
