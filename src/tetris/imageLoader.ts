import config from './config'

class ImageLoader {
  private bricks: HTMLImageElement[] = []

  constructor() {
    this.loadBricks()
  }

  getBrickByColor(index: number) {
    return this.bricks[index - 1]
  }

  private loadBricks() {
    for (const url of config.bricks) {
      const img = new Image()
      img.src = url

      img.onload = () => {
        // we dont care about order
        this.bricks.push(img)
      }
    }
  }
}

export default new ImageLoader()
