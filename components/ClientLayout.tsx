'use client'

import { ReactNode } from 'react'
import MobileOnlyHeader from './MobileOnlyHeader'

interface ClientLayoutProps {
  children: ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      {/* Mobile Islands - Persistent across all pages */}
      <div className="md:hidden">
        <MobileOnlyHeader />
      </div>
      
      {children}
    </>
  )
}
