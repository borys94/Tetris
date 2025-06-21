import React from 'react'
import styles from './Game.module.scss'
import Tetris from './Tetris/Tetris'

const Game: React.FC = () => {
  return (
    <div className={styles.container}>
      <Tetris />
    </div>
  )
}

export default Game
