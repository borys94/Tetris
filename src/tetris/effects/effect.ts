import type Game from '..'

export abstract class Effect {
  private elapsed = 0
  protected progress = 0
  protected abstract duration: number

  constructor(protected game: Game) {}

  abstract enter(): void
  abstract render(ctx: CanvasRenderingContext2D): void

  update(deltaTime: number) {
    this.elapsed += deltaTime
    this.progress = this.elapsed / this.duration
  }

  isFinished(): boolean {
    return this.elapsed >= this.duration
  }
}
