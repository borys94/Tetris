import React from 'react'
import styles from './Leaderboard.module.scss'

const Leaderboard: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Leaderboard</h2>
      <div className={styles.scores}>
        {/* Leaderboard data will be added here */}
        <p>Leaderboard coming soon!</p>
      </div>
    </div>
  )
}

export default Leaderboard
