import { useEffect } from 'react'
import styles from './tetris.module.scss'
import Tetris from '../../tetris'

const Board = () => {
  useEffect(() => {
    const tetris = new Tetris(document.getElementById('board') as HTMLCanvasElement)
    tetris.start()

    // return () => {
    //   // tetris.current.destroy()
    // }
  }, [])

  return (
    <div className={styles.container}>
      <canvas id="board" />
    </div>
  )
}

export default Board
