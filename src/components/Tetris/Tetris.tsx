import { useEffect, useRef } from 'react'
import styles from './tetris.module.scss'
import Tetris from '../../tetris'
import { GameEngine } from '../../tetris/rendering/gameEngine'

const Board = () => {
  // const tetrisRef = useRef<Tetris>(null)

  useEffect(() => {
    const gameEngine = new GameEngine(document.getElementById('board') as HTMLCanvasElement)
    gameEngine.start()
    // const canvas = document.getElementById('board') as HTMLCanvasElement
    // tetrisRef.current = new Tetris(canvas)

    // return () => {
    //   // tetrisRef.current.destroy()
    // }
  }, [])

  return (
    <div className={styles.container}>
      <canvas id="board" />
    </div>
  )
}

export default Board
