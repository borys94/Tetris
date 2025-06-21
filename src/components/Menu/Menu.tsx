import { Link } from 'react-router-dom'
import styles from './Menu.module.scss'

const Menu = () => {
  return (
    <div className={styles.container}>
      <div className={styles.topItems}>
        <MenuItem label="Home" to="/" />
        <MenuItem label="Game" to="/game" />
        <MenuItem label="Leaderboard" to="/leaderboard" />
      </div>
      <div>
        <MenuItem label="Settings" onClick={() => {}} />
        <MenuItem label="Github" to="/settings" />
      </div>
    </div>
  )
}

type MenuItemProps = {
  label: string
  to?: string
  onClick?: () => void
}

const MenuItem = ({ label, to, onClick }: MenuItemProps) => {
  return (
    <div className={styles.menuItem}>
      {to ? <Link to={to}>{label}</Link> : <div onClick={onClick}>{label}</div>}
    </div>
  )
}

export default Menu
