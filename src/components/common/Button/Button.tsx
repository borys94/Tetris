import type { ReactNode } from 'react'
import styles from './Button.module.scss'
import classNames from 'classnames'

type Variant = 'primary' | 'secondary' | 'tertiary'
type Size = 'sm' | 'md' | 'lg'

type Props = {
  variant?: Variant
  size?: Size
  onClick?: () => void
  children: ReactNode
}

const Button = ({ variant = 'primary', size = 'md', onClick, children }: Props) => {
  return (
    <button
      className={classNames(styles.button, styles[`button-${variant}`], styles[`button-${size}`])}
      onClick={onClick}
    >
      <span>{children}</span>
    </button>
  )
}

export default Button
