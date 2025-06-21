import React from 'react'
import styles from './App.module.scss'
import Menu from './components/Menu/Menu'
import Tetris from './components/Tetris/Tetris'

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <Menu />
      <main className={styles.main}>
        <Tetris />
      </main>
    </div>
  )
}

export default App
