import { useState } from 'react'
import styles from './Menu.module.scss'
import SettingsModal from './SettingsModal/SettingsModal'

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={styles.container}>
      <div className={styles.topItems}>
        <MenuItem>My results</MenuItem>
      </div>
      <div>
        <MenuItem onClick={() => setIsOpen(true)}>Settings</MenuItem>
        <a className={styles.menuItem} href="https://github.com/borys94/Tetris" target="_blank">
          Github
        </a>
      </div>
      <SettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}

type MenuItemProps = {
  onClick?: () => void
  children?: React.ReactNode
}

const MenuItem = ({ onClick, children }: MenuItemProps) => {
  return (
    <div className={styles.menuItem}>
      <div onClick={onClick}>{children}</div>
    </div>
  )
}

export default Menu
