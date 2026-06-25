'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ScanLine, MapPinned, Users, GraduationCap, LogOut, ChevronRight, Lock } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { logoutStaff } from '@/app/actions/staff-auth'

const adminNavigation = [
  { name: 'Command Center', href: '/command-center', icon: LayoutDashboard },
  { name: 'Gate Entrance', href: '/gate-entrance', icon: ScanLine },
  { name: 'Ground Operations', href: '/ground-ops', icon: MapPinned },
  { name: 'Student Registry', href: '/student-registry', icon: GraduationCap },
  { name: 'Staff Directory', href: '/staff-directory', icon: Users },
  { name: 'Staff Management', href: '/staff-management', icon: Lock },
]

const staffNavigation = [
  { name: 'Staff Portal', href: '/staff-portal', icon: ScanLine },
  { name: 'Command Center', href: '/command-center', icon: LayoutDashboard },
  { name: 'Staff Management', href: '/staff-management', icon: Lock },
]

export function Sidebar({ userName, userType }: { userName?: string; userType?: 'admin' | 'staff' }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    if (userType === 'staff') {
      await logoutStaff()
      router.push('/staff-login')
    } else {
      await logout()
      router.push('/login')
    }
    router.refresh()
  }

  const navigation = userType === 'staff' ? staffNavigation : adminNavigation

  return (
    <aside className="w-72 shrink-0 bg-primary/95 text-white flex flex-col border-r border-primary/20 shadow-[0_24px_80px_rgba(15,23,42,0.24)] backdrop-blur hidden md:flex">
      <div className="p-6 border-b border-white/10 bg-white/5 max-md:hidden">
        <div className="mb-4 flex justify-center">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-1-zoFmQvusRlyZECyVQKBwJ9i9f9aPw7.webp" 
            alt="Abu Dhabi Indian School Logo" 
            className="h-16 w-16 object-contain"
          />
        </div>
        <div>
          <p className="text-center text-[10px] uppercase tracking-[0.35em] text-white/60">{userType === 'staff' ? 'Gate Staff' : 'Campus Operations'}</p>
          <h1 className="text-center text-lg font-semibold text-balance leading-tight">ADIS OT-Connect</h1>
        </div>
        <p className="mt-4 text-sm leading-6 text-white/70">
          {userType === 'staff' ? 'Manage student dispersals and pickups.' : 'Secure dismissal workflow, live tracking, and school-wide coordination.'}
        </p>
      </div>

      <nav className="flex-1 p-2 md:p-4 space-y-1 md:space-y-2 overflow-y-auto w-full md:w-72">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-2 md:gap-3 rounded-lg px-2 md:px-3 py-2 md:py-2.5 text-xs font-medium uppercase tracking-[0.15em] md:tracking-[0.2em] transition ${
                isActive
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-xs md:text-xs">{item.name}</span>
              {isActive && <ChevronRight className="h-4 w-4 hidden md:block" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-2 md:p-4 border-t border-white/10 space-y-2 md:space-y-3 bg-black/10">
        {userName && (
          <div className="rounded-lg md:rounded-2xl border border-white/10 bg-white/8 px-2 md:px-4 py-2 md:py-3">
            <p className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.24em] text-white/60">Logged in as</p>
            <p className="mt-1 text-xs md:text-sm font-medium truncate text-white">{userName}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-2xl border border-white/10 bg-white/8 text-white transition hover:bg-white/12 text-xs md:text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </aside>
  )
}
