import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  children: ReactNode
}

const Portal = ({ children }: Props) => {
  return createPortal(children, document.body)
}

export default Portal
