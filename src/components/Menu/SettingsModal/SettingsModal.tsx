import Modal from '../../common/Modal/Modal'
import styles from './SettingsModal.module.scss'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const SettingsModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal open={isOpen} onClose={onClose} title="Settings">
      <h1>Settings</h1>
    </Modal>
  )
}

export default SettingsModal
