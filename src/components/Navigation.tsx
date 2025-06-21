import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Navigation.module.scss'

const Navigation: React.FC = () => {
  return (
    <nav className={styles.navigation}>
      <ul className={styles.list}>
        <li>
          <Link to="/" className={styles.link}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/game" className={styles.link}>
            Play Game
          </Link>
        </li>
        <li>
          <Link to="/leaderboard" className={styles.link}>
            Leaderboard
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
