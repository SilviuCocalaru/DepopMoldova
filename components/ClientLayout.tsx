'use client'

import { ReactNode } from 'react'
import MobileOnlyHeader from './MobileOnlyHeader'
import InstallPrompt from './InstallPrompt'

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
      
      {/* Install Prompt for PWA */}
      <InstallPrompt />
      
      {children}
    </>
  )
}
