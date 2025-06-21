import blueBrick from '../assets/bricks/blue.png'
import yellowBrick from '../assets/bricks/yellow.png'
import cyanBrick from '../assets/bricks/cyan.png'
import redBrick from '../assets/bricks/red.png'
import purpleBrick from '../assets/bricks/purple.png'

const height = 16
const width = 10
const brickSize = 40
const margin = 16

const config = {
  bricks: [blueBrick, yellowBrick, cyanBrick, redBrick, purpleBrick],
  rightPanel: {
    width: 250,
    height: height * brickSize + margin * 2,
    margin,
  },
  board: {
    width: width * brickSize + margin * 2,
    height: height * brickSize + margin * 2,
    brickSize,
    bricksX: width,
    bricksY: height,
    margin,
    backgroundColor: 'rgb(224, 224, 224)',
  },
}

export default config