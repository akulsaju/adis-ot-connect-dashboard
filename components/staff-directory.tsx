'use client'

import { useState, useEffect } from 'react'
import { getStaffDirectory, addStaffMember } from '@/app/actions/dismissal'
import { Phone, Mail, User, UserPlus, BadgeInfo, Users } from 'lucide-react'

interface StaffMember {
  id: number
  staffName: string
  role: string
  block: string | null
  phone: string | null
  email: string | null
  isActive: boolean
}

export function StaffDirectory() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string | null>(null)
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'gate_staff',
    block: '',
    phone: '',
    email: '',
  })

  const ROLES = ['gate_staff', 'ground_ops', 'supervisor']

  // Filter staff based on search and role
  const filteredStaff = staff.filter(s => {
    const matchesSearch =
      s.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.phone && s.phone.includes(searchTerm))
    const matchesRole = !filterRole || s.role === filterRole
    return matchesSearch && matchesRole
  })

  useEffect(() => {
    loadStaff()
  }, [])

  async function loadStaff() {
    try {
      const data = await getStaffDirectory()
      setStaff((data || []) as StaffMember[])
    } catch (error) {
      console.error('Failed to load staff:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStaff.name || !newStaff.email) {
      alert('Please fill required fields')
      return
    }

    try {
      await addStaffMember(newStaff.name, newStaff.role, newStaff.block, newStaff.phone, newStaff.email)
      setNewStaff({ name: '', role: 'gate_staff', block: '', phone: '', email: '' })
      await loadStaff()
    } catch (error) {
      console.error('Failed to add staff:', error)
      alert('Failed to add staff member')
    }
  }

  const roleLabels: Record<string, string> = {
    gate_staff: '🚪 Gate Staff',
    ground_ops: '📍 Ground Operations',
    supervisor: '👨‍💼 Supervisor',
  }

  return (
    <div className="flex-1 overflow-auto p-6 sm:p-8 space-y-6 lg:space-y-8">
      <div className="rounded-[2rem] border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Contacts</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Staff Directory</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage OT staff members and contact information.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            {staff.length} staff members
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-[1.75rem] border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Add Staff Member</h3>
              <p className="text-sm text-muted-foreground">Capture contact details and role.</p>
            </div>
          </div>
          <form onSubmit={handleAddStaff} className="space-y-4 mt-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Name *</label>
              <input
                type="text"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Role</label>
              <select
                value={newStaff.role}
                onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                <option value="gate_staff">Gate Staff</option>
                <option value="ground_ops">Ground Operations</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Block</label>
              <select
                value={newStaff.block}
                onChange={(e) => setNewStaff({ ...newStaff, block: e.target.value })}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                <option value="">All Blocks</option>
                <option value="KG">KG</option>
                <option value="Girls Block">Girls Block</option>
                <option value="Boys Block">Boys Block</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Phone</label>
              <input
                type="tel"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                placeholder="+971 50 123 4567"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Email *</label>
              <input
                type="email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                placeholder="email@adis.ae"
              />
            </div>

            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Add Staff Member
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 overflow-hidden rounded-[1.75rem] border border-border/60 bg-card shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-border/60 p-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Active Staff ({filteredStaff.length})</h3>
              <p className="mt-1 text-sm text-muted-foreground">Search by name, email, or phone.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <BadgeInfo className="h-4 w-4 text-primary" />
              Contact directory
            </div>
          </div>

          <div className="border-b border-border/60 p-4 space-y-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterRole(null)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  filterRole === null
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                All Roles
              </button>
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    filterRole === role
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {roleLabels[role] || role}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border/60 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading staff...</div>
            ) : staff.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No staff members added yet</div>
            ) : filteredStaff.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No staff match your search</div>
            ) : (
              filteredStaff.map((member) => (
                <div key={member.id} className="p-6 hover:bg-muted/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-foreground">{member.staffName}</p>
                      <p className="text-sm text-muted-foreground">{roleLabels[member.role] || member.role}</p>
                      {member.block && <p className="mt-1 text-xs text-muted-foreground">{member.block}</p>}
                      <div className="mt-3 flex flex-wrap gap-3">
                        {member.phone && (
                          <a href={`tel:${member.phone}`} className="text-xs flex items-center gap-1 text-primary hover:underline">
                            <Phone className="w-3 h-3" />
                            {member.phone}
                          </a>
                        )}
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="text-xs flex items-center gap-1 text-primary hover:underline">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
