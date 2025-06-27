export const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  canvas.width = width
  canvas.height = height

  setHighDpiCanvas(canvas, width, height)

  return { canvas, ctx }
}

export const setHighDpiCanvas = (canvas: HTMLCanvasElement, width: number, height: number) => {
  const ratio = window.devicePixelRatio
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.width = width * ratio
  canvas.height = height * ratio

  canvas.getContext('2d')?.scale(ratio, ratio)
}

export const cloneCanvas = (canvas: HTMLCanvasElement, newCanvas: HTMLCanvasElement) => {
  newCanvas.width = canvas.width
  newCanvas.height = canvas.height
  newCanvas.style.width = canvas.style.width
  newCanvas.style.height = canvas.style.height
  newCanvas.getContext('2d')?.drawImage(canvas, 0, 0)
  return newCanvas
}

export const clearCanvas = (canvas: HTMLCanvasElement) => {
  canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
}

export const drawCanvas = (
  ctx: CanvasRenderingContext2D,
  newCanvas: HTMLCanvasElement,
  x: number,
  y: number
) => {
  const ratio = window.devicePixelRatio
  ctx.save()
  ctx.scale(1 / ratio, 1 / ratio)
  ctx?.drawImage(newCanvas, x * ratio, y * ratio)
  ctx.restore()
}

export const getCanvasSize = (canvas: HTMLCanvasElement) => {
  const ratio = window.devicePixelRatio
  return {
    width: canvas.width / ratio,
    height: canvas.height / ratio,
  }
}
