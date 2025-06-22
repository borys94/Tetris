import Modal from '../../common/Modal/Modal'
import styles from './ScoringModal.module.scss'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ScoringModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal open={isOpen} onClose={onClose} title="Scoring system">
      <div className={styles.scoringSystem}>
        {SCORING_SYSTEM.map((item) => (
          <div className={styles.scoringSystemItem} key={item.title}>
            <div className={styles.scoringSystemItemTitle}>{item.title}</div>
            <div className={styles.scoringSystemItemValue}>{item.value}</div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default ScoringModal

const SCORING_SYSTEM: Array<{
  title: string
  value: string
}> = [
  {
    title: 'Single line',
    value: '100 × level',
  },
  {
    title: 'Double line',
    value: '300 × level',
  },
  {
    title: 'Triple line',
    value: '500 × level',
  },
  {
    title: 'Tetris',
    value: '800 × level',
  },
  {
    title: 'Mini T-Spin',
    value: '100 × level',
  },
  {
    title: 'Mini T-Spin Single',
    value: '200 × level',
  },
  {
    title: 'T-Spin/Mini T-Spin Double',
    value: '400 × level',
  },
  {
    title: 'B2B Mini T-Spin Double',
    value: '600 × level',
  },
  {
    title: 'T-Spin Single',
    value: '800 × level',
  },
  {
    title: 'B2B T-Spin Single/B2B Tetris/T-Spin Double',
    value: '1200 × level',
  },
  {
    title: 'T-Spin Triple',
    value: '1600 × level',
  },
  {
    title: 'B2B T-Spin Double',
    value: '1800 × level',
  },
  {
    title: 'B2B T-Spin Triple',
    value: '2400 × level',
  },
  {
    title: 'Combo',
    value: '(move value+50) × level',
  },
  {
    title: 'Soft drop',
    value: '1 point per cell',
  },
  {
    title: 'Hard drop',
    value: '2 points per cell',
  },
]
