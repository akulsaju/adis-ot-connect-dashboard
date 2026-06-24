import bcrypt from 'bcryptjs'

const requireFn = eval('require') as (moduleName: string) => any
const fs = requireFn('fs').promises as any
const path = requireFn('path') as any

const DATA_DIR = path.join((globalThis as any).process.cwd(), '.data')
const DB_PATH = path.join(DATA_DIR, 'local-db.json')

const DEFAULT_ADMIN_USERNAME = 'admin'
const DEFAULT_ADMIN_EMAIL = 'admin@adis.ae'
const DEFAULT_ADMIN_PASSWORD = 'Adis@2025'

export interface LocalAdmin {
  id: number
  username: string
  email: string
  passwordHash: string
  name: string
  createdAt: string
}

export interface LocalNfcTag {
  id: number
  nfcCode: string
  studentId: string
  studentName: string
  class: string
  block: string
  createdAt: string
}

export interface LocalDismissal {
  id: number
  studentId: string
  studentName: string
  class: string
  block: string
  parentName: string
  parentPhone: string
  pickupMethod: string
  nfcScanTime: string | null
  gateScanTime: string | null
  groundOpsTime: string | null
  finalDismissalTime: string | null
  status: string
  notes: string | null
  userId: string
  createdAt: string
}

export interface LocalStaffMember {
  id: number
  staffName: string
  role: string
  block: string | null
  phone: string | null
  email: string | null
  isActive: boolean
  userId: string
  createdAt: string
}

export interface LocalDbState {
  admin: LocalAdmin[]
  nfcTags: LocalNfcTag[]
  dismissals: LocalDismissal[]
  staffDirectory: LocalStaffMember[]
}

const emptyState = (): LocalDbState => ({
  admin: [],
  nfcTags: [],
  dismissals: [],
  staffDirectory: [],
})

let lock = Promise.resolve()

function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = lock.then(task, task)
  lock = run.then(() => undefined, () => undefined)
  return run
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

async function createDefaultAdminIfNeeded(state: LocalDbState) {
  if (state.admin.length > 0) {
    return false
  }

  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10)
  state.admin.push({
    id: 1,
    username: DEFAULT_ADMIN_USERNAME,
    email: DEFAULT_ADMIN_EMAIL,
    passwordHash,
    name: 'Admin Staff',
    createdAt: new Date().toISOString(),
  })
  return true
}

async function loadState(): Promise<LocalDbState> {
  await ensureDataDir()

  try {
    const raw = await fs.readFile(DB_PATH, 'utf8')
    const parsed = JSON.parse(raw) as Partial<LocalDbState>
    const state: LocalDbState = {
      ...emptyState(),
      ...parsed,
      admin: parsed.admin || [],
      nfcTags: parsed.nfcTags || [],
      dismissals: parsed.dismissals || [],
      staffDirectory: parsed.staffDirectory || [],
    }

    return state
  } catch {
    const state = emptyState()
    await createDefaultAdminIfNeeded(state)
    await fs.writeFile(DB_PATH, JSON.stringify(state, null, 2), 'utf8')
    return state
  }
}

async function saveState(state: LocalDbState) {
  await ensureDataDir()
  await fs.writeFile(DB_PATH, JSON.stringify(state, null, 2), 'utf8')
}

function nextId<T extends { id: number }>(items: T[]) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

function sortByCreatedAtDesc<T extends { createdAt: string }>(items: T[]) {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function readLocalDb() {
  return withLock(async () => {
    const state = await loadState()
    const changed = await createDefaultAdminIfNeeded(state)
    if (changed) {
      await saveState(state)
    }
    return state
  })
}

export async function updateLocalDb<T>(mutator: (state: LocalDbState) => Promise<T> | T) {
  return withLock(async () => {
    const state = await loadState()
    await createDefaultAdminIfNeeded(state)
    const result = await mutator(state)
    await saveState(state)
    return result
  })
}

export async function findAdminByLogin(login: string) {
  const state = await readLocalDb()
  const normalized = login.trim().toLowerCase()
  return (
    state.admin.find(
      (admin) =>
        admin.username.toLowerCase() === normalized ||
        admin.email.toLowerCase() === normalized
    ) || null
  )
}

export async function getAdminById(id: number) {
  const state = await readLocalDb()
  return state.admin.find((admin) => admin.id === id) || null
}

export async function ensureDefaultAdminAccount() {
  await updateLocalDb(async () => undefined)
}

export { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, DEFAULT_ADMIN_USERNAME, nextId, sortByCreatedAtDesc }
