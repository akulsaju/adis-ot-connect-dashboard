'use client'

import { ReactNode, useState } from 'react'
import { Sidebar } from './sidebar'
import { Menu, X } from 'lucide-react'

interface LayoutWrapperProps {
  children: ReactNode
  userName?: string
  userType?: 'admin' | 'staff'
}

export function LayoutWrapper({ children, userName, userType }: LayoutWrapperProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background text-foreground">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-primary/95 text-white px-4 py-3 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-1-zoFmQvusRlyZECyVQKBwJ9i9f9aPw7.webp" 
            alt="Logo" 
            className="h-8 w-8 object-contain"
          />
          <span className="text-sm font-semibold">ADIS OT-Connect</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 hover:bg-white/10 rounded-lg transition"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Sidebar - Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary/95 text-white border-b border-primary/20">
          <Sidebar userName={userName} userType={userType} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar userName={userName} userType={userType} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden md:rounded-tl-3xl border-l border-border/60 bg-background/80 shadow-[0_0_0_1px_rgba(255,255,255,0.35)_inset] backdrop-blur supports-[backdrop-filter]:bg-background/70">
          {children}
        </div>
      </main>
    </div>
  )
}
