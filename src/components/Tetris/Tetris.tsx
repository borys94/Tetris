import { useEffect, useRef } from 'react'
import styles from './tetris.module.scss'
import Tetris from '../../tetris'
import useTetris from '../../hooks/useTetris'

const Board = () => {
  const tetrisRef = useRef<Tetris>(null)

  const { isGameStarted, setIsGameStarted } = useTetris()

  useEffect(() => {
    const canvas = document.getElementById('board') as HTMLCanvasElement
    tetrisRef.current = new Tetris(canvas)

    return () => {
      // tetrisRef.current.destroy()
    }
  }, [])

  return (
    <div className={styles.container}>
      <canvas id="board" />
    </div>
  )
}

export default Board
