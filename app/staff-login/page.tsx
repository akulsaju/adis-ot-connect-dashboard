import { redirect } from 'next/navigation'

export default function Page() {
  // Redirect to unified login page with staff tab
  redirect('/login')
}
