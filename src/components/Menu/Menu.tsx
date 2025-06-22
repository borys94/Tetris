import { useState } from 'react'
import styles from './Menu.module.scss'
import SettingsModal from './SettingsModal/SettingsModal'
import ScoringModal from './ScoringModal/ScoringModal'

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScoringOpen, setIsScoringOpen] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.topItems}>
        <MenuItem>My results</MenuItem>
        <MenuItem onClick={() => setIsScoringOpen(true)}>Scoring system</MenuItem>
      </div>
      <div>
        <MenuItem onClick={() => setIsOpen(true)}>Settings</MenuItem>
        <a className={styles.menuItem} href="https://github.com/borys94/Tetris" target="_blank">
          Github
        </a>
      </div>
      <SettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <ScoringModal isOpen={isScoringOpen} onClose={() => setIsScoringOpen(false)} />
    </div>
  )
}

type MenuItemProps = {
  onClick?: () => void
  children?: React.ReactNode
}

const MenuItem = ({ onClick, children }: MenuItemProps) => {
  return (
    <div className={styles.menuItem} onClick={onClick}>
      <div>{children}</div>
    </div>
  )
}

export default Menu
