import { getStaffSession, logoutStaff } from '@/app/actions/staff-auth'
import { redirect } from 'next/navigation'
import { DispersalConsole } from '@/components/dispersal-console'
import { LogOut } from 'lucide-react'

export default async function Page() {
  const session = await getStaffSession()
  
  if (!session) {
    redirect('/staff-login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gate Staff Portal</h1>
            <p className="text-sm text-muted-foreground">Welcome, {session.staffName}</p>
          </div>
          <form
            action={async () => {
              'use server'
              await logoutStaff()
              redirect('/staff-login')
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DispersalConsole />
      </main>
    </div>
  )
}
