import type { ReactNode } from 'react'
import Portal from '../layout/Portal'
import styles from './Modal.module.scss'
import Button from '../Button/Button'
import classNames from 'classnames'

export type Size = 'small' | 'medium' | 'large'

type Props = {
  children: ReactNode
  title: string
  onClose: () => void
  open: boolean
  confirmButton?: ReactNode
  cancelButton?: ReactNode
  size?: Size
}

const Modal = ({
  children,
  title,
  onClose,
  open,
  confirmButton,
  cancelButton,
  size = 'medium',
}: Props) => {
  if (!open) return null

  return (
    <Portal>
      <div className={styles.container}>
        <div className={styles.overlay} onClick={onClose} />
        <div className={classNames(styles.modal, styles[`${size}Modal`])}>
          <div className={styles.modalHeader}>
            <span className={styles.modalTitle}>{title}</span>
            <div className={styles.closeIcon} onClick={onClose}>
              <span className="material-symbols-outlined">close</span>
            </div>
          </div>
          <div>{children}</div>
          {confirmButton ||
            (cancelButton && (
              <div className={styles.modalFooter}>
                {cancelButton && (
                  <Button onClick={onClose} variant="secondary">
                    {cancelButton}
                  </Button>
                )}
                {confirmButton && (
                  <Button onClick={onClose} variant="primary">
                    {confirmButton}
                  </Button>
                )}
              </div>
            ))}
        </div>
      </div>
    </Portal>
  )
}

export default Modal
