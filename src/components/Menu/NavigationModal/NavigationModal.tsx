import Modal from '../../common/Modal/Modal'
import styles from './NavigationModal.module.scss'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const NavigationModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal open={isOpen} onClose={onClose} title="Navigation" size="small">
      <div className={styles.keysContainer}>
        {KEYS.map((key) => (
          <div className={styles.keyNavigation}>
            <div className={styles.keyWrapper}>
              <Key>{key.key}</Key>
            </div>
            <div className={styles.keyDescription}>{key.description}</div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default NavigationModal

// TODO: consider move to common folder
const Key = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.key}>{children}</div>
}

const KEYS: Array<{ key: string; description: string }> = [
  {
    key: '⭠',
    description: 'Move left',
  },
  {
    key: '⭢',
    description: 'Move right',
  },
  {
    key: '⭡',
    description: 'Rotate',
  },
  {
    key: '⭣',
    description: 'Soft drop',
  },
  {
    key: 'Space',
    description: 'Hard drop',
  },
  {
    key: 'P',
    description: 'Pause',
  },
]
