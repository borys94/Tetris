import React, { useState } from 'react'
import styles from './Home.module.scss'
import Button from '../components/common/Button/Button'
import Modal from '../components/common/Modal/Modal'

const Home: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={styles.container}>
      {/* <Button />
      <Button variant="secondary" />
      <Button size="sm" />
      <Button size="md" />
      <Button size="lg" /> */}

      <Button size="md" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <Modal
        open={isOpen}
        title="Modal Title"
        onClose={() => setIsOpen(false)}
        confirmButton="Confirm"
        cancelButton="Cancel"
      >
        xxx
      </Modal>
    </div>
  )
}

export default Home
