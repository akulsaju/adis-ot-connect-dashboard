import { getSession } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { ParentManagement } from '@/components/parent-management'

export const metadata = {
  title: 'Parent Management | ADIS OT Connect',
  description: 'Manage parents and link children for group pickups',
}

export default async function ParentManagementPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <LayoutWrapper userName={session.name || 'Admin'} userType="admin">
      <ParentManagement />
    </LayoutWrapper>
  )
}
