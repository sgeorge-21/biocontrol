# Frontend Setup for Development

## Quick Start

### 1. Install Dependencies
```bash
npm install
# or
bun install
```

### 2. Stop and Restart Dev Server
**IMPORTANT**: You must restart the dev server after making changes to environment variables!

```bash
# Stop the current dev server (Ctrl+C in the terminal)
# Then start it again:
npm run dev
# or
bun run dev
```

### 3. Environment Configuration

The app uses mock authentication by default (no backend needed).

**File: `.env.local`** (in root directory)
```env
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK_API=true
```

### 4. Access the App

- Open browser: `http://localhost:8080`
- You should see the login screen
- Click "Sign up" to create an account
- Use any email and password (at least 8 characters)
- You'll be logged in immediately

## Troubleshooting

### "Failed to fetch" on Sign Up

**Solution**: Restart the dev server!

1. Stop the dev server: Press `Ctrl+C` in terminal
2. Start it again: `npm run dev` or `bun run dev`
3. Try signing up again

### Still seeing "Failed to fetch"?

**Check the browser console** (F12):
- Look for debug logs like: `Auth Config: { API_URL, USE_MOCK_API, ... }`
- If `USE_MOCK_API` is `true`, the app should use mock mode
- Check for any JavaScript errors

### Using Real Backend

To use the actual backend API instead of mock mode:

1. Update `.env.local`:
```env
VITE_USE_MOCK_API=false
```

2. Set up the backend:
```bash
cd backend
pip install -r requirements.txt
python init_db.py  # Requires PostgreSQL
python -m flask run
```

3. Restart the frontend dev server

## Port Numbers

- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:5000

## Features

### Authentication (Mock Mode)
- ✅ Sign up with email/password
- ✅ Login with credentials
- ✅ Profile management
- ✅ Logout
- ✅ Persistent sessions

### App Features (After Login)
- ✅ AI Symptom Assessment
- ✅ Education Resources
- ✅ Outbreak Monitoring
- ✅ Health Facility Finder

## Development Notes

- Mock mode stores user data in localStorage
- Each session has a unique token
- All data is browser-local (no server needed)
- Perfect for testing UI/UX
- Switch to real backend when ready for data persistence
