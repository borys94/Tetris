import { useState } from 'react'

const useTetris = () => {
  const [isGameStarted, setIsGameStarted] = useState(false)

  return {
    isGameStarted,
    setIsGameStarted,
  }
}

export default useTetris
