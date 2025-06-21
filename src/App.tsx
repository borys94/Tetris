import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Game from './pages/Game/Game'
import Leaderboard from './pages/Leaderboard'
import styles from './App.module.scss'
import Menu from './components/Menu/Menu'

const App: React.FC = () => {
  return (
    <Router>
      <div className={styles.app}>
        <Menu />
        {/* <Navigation /> */}
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
