# Admin Account Setup

## Quick Start

The app now uses an embedded local database stored in `.data/local-db.json`.
The default admin account is created automatically on first run.

### Step 1: Open the login page

1. Open your browser and go to: `http://localhost:3000/login`
2. Sign in with the credentials below

### Step 2: Login

- **Username:** `admin`
- **Email:** `admin@adis.ae`
- **Password:** `Adis@2025`

You'll be redirected to the Command Center dashboard.

## Important Security Notes

⚠️ **After completing setup:**

1. Change the default password if you plan to keep the local database for production use
2. Never commit credentials to version control
3. Use strong, unique passwords for production deployments

## Troubleshooting

### "Admin account already exists"

The admin account is automatically created. Just go to `/login` and sign in with the credentials above.

### "Connection error" or "Failed to create account"

Make sure:
- Your Neon database is connected (check `DATABASE_URL` in `.env.local`)
- The Better Auth environment variables are set (`BETTER_AUTH_SECRET`)
- The dev server is running without errors

### Can't login with credentials

1. Make sure you're using the correct username or email: `admin` or `admin@adis.ae`
2. Password is case-sensitive: `Adis@2025`
3. Make sure the app can write to `.data/local-db.json`

## Dashboard Access

Once logged in, you can access:

- **Command Center** - Real-time dismissal overview
- **Gate Entrance** - NFC scanner for student arrivals
- **Ground Operations** - Manage dismissal queue
- **Student Registry** - Manage NFC tags and student records
- **Staff Directory** - Manage staff contacts

## Production Deployment

This local database approach is best for self-hosted or locally hosted deployments.
If you deploy to Vercel, the file-based database will not persist between deployments.
