'use server'

import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { DEFAULT_ADMIN_PASSWORD, findAdminByLogin, getAdminById, updateLocalDb } from '@/lib/local-db'

export async function loginAdmin(username: string, password: string) {
  try {
    const admin = await findAdminByLogin(username)

    if (!admin) {
      return { success: false, error: 'Invalid username or password' }
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash)

    if (!isPasswordValid) {
      return { success: false, error: 'Invalid username or password' }
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', admin.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'An error occurred during login' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('admin_session')?.value

  if (!sessionId) {
    return null
  }

  try {
    const admin = await getAdminById(parseInt(sessionId))
    if (!admin) {
      return null
    }

    return {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      name: admin.name,
      createdAt: admin.createdAt,
    }
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}
