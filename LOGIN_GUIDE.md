# ADIS OT-Connect - Login System

## Quick Start

### Credentials
- **Username:** `admin`
- **Password:** `Adis@2025`

The app now stores data in `.data/local-db.json` and uses the custom `/login` page.

## How to Access

### 1. Start the Application
```bash
cd /vercel/share/v0-project
pnpm dev
```

### 2. Go to Login Page
Navigate to: `http://localhost:3000/login`

### 3. Enter Credentials
- Enter `admin` as username
- Enter `Adis@2025` as password
- Click Login

### 4. Access Portals
Once logged in, you can access all portals:

| Portal | URL | Description |
|--------|-----|-------------|
| **Command Center** | `/command-center` | Real-time monitoring and NFC management |
| **Gate Entrance** | `/gate-entrance` | NFC student scanning at gate |
| **Ground Operations** | `/ground-ops` | Student queuing and dispatch |
| **Student Registry** | `/student-registry` | Student and NFC tag management |
| **Staff Directory** | `/staff-directory` | Staff member management |

## Features

### Authentication
- Simple username/password login
- Session-based authentication using cookies
- Protected routes redirect unauthenticated users to login
- Sign Out button in sidebar for all portals

### Security
- Password hashing with bcryptjs
- Embedded local database storage
- Session validation on each request
- Automatic logout redirect when accessing protected pages

### Database
- Admin user stored in `.data/local-db.json`
- Credentials: `username='admin'`, `email='admin@adis.ae'`, `password='Adis@2025'`

## Troubleshooting

### Login Not Working
1. Verify the dev server is running: `pnpm dev`
2. Make sure the app can write to `.data/local-db.json`
3. Delete `.data/local-db.json` if you want the app to reseed the default admin

### Can't Access Portals
1. You must be logged in - redirects to login page if not authenticated
2. Log in with `admin/Adis@2025`

### Need to Change Password
Update the password hash in `.data/local-db.json` or add a password change flow.

## Database Setup

The admin account is seeded automatically into `.data/local-db.json` on first use.

## Environment Variables Required

### .env.local
```
# No database URL is required for local hosting
```

## API Endpoints

### Login
- Use the `/login` page and sign in with the local credentials above

### Logout
- Use the sign out button in the sidebar

## Session Management

- Sessions are stored in cookies (HTTP-only)
- Each request validates the session on the server
- Session automatically expires after inactivity (configurable)
- Sign Out button explicitly clears the session

## Production Notes

1. Change the default password before deploying
2. Use HTTPS in production
3. Set secure cookie flags for production
4. Consider implementing 2FA for higher security
5. Regularly audit login attempts and access logs
