# Authentication System Setup

This guide explains how to set up and use the authentication system for the Liberia Malaria Monitoring System.

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

The key new dependencies are:
- `PyJWT==2.8.1` - For JWT token generation and verification
- `Flask-SQLAlchemy==3.1.1` - For ORM database operations
- `Werkzeug==3.0.1` - For secure password hashing

### 2. Database Migration

Create the users table and related tables:

```bash
python init_db.py
```

Or manually create the table with:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth TIMESTAMP,
    location VARCHAR(255),
    county VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_email ON users(email);
```

### 3. Environment Variables

Add to your `.env` file:

```env
SECRET_KEY=your-secret-key-change-in-production
FLASK_ENV=development
FLASK_DEBUG=True
```

### 4. Start the Backend

```bash
python -m flask run
```

The API will be available at `http://localhost:5000`

## Frontend Setup

### 1. Environment Variables

Add to your `.env.local` file:

```env
VITE_API_URL=http://localhost:5000
```

### 2. Start the Frontend

```bash
npm run dev
# or
bun run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

### Authentication Routes

All authentication endpoints are prefixed with `/api/auth`

#### 1. Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}

Response:
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "created_at": "2024-01-27T10:00:00"
  }
}
```

#### 2. Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "last_login": "2024-01-27T10:00:00"
  }
}
```

#### 3. Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    ...
  }
}
```

#### 4. Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Jane Doe",
  "phone": "+1-555-0000",
  "location": "Monrovia",
  "county": "Montserrado"
}

Response:
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### 5. Logout
```
POST /api/auth/logout
Authorization: Bearer <token>

Response:
{
  "message": "Logged out successfully"
}
```

## Frontend Components

### AuthContext Hook

Use the `useAuth` hook to access authentication state and methods:

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, register, logout, updateProfile } = useAuth();

  // Use these functions and state
}
```

### Components

- **Login** (`/src/components/Auth/Login.tsx`) - Login form
- **SignUp** (`/src/components/Auth/SignUp.tsx`) - Registration form
- **Dashboard** (`/src/pages/Dashboard.tsx`) - User profile and settings
- **ProtectedRoute** (`/src/components/Auth/ProtectedRoute.tsx`) - Route guard for authenticated users
- **Header** (`/src/components/Header.tsx`) - Navigation with user menu

### Routes

- `/login` - Login page
- `/signup` - Registration page
- `/dashboard` - User dashboard (protected)
- `/` - Home page with header showing auth status

## Features

### User Registration
- Email validation
- Password hashing with Werkzeug
- Automatic token generation
- User data storage

### User Login
- Email/password authentication
- Last login tracking
- JWT token generation (7-day expiry)
- Token refresh on page load

### Profile Management
- Update full name, phone, location, county
- View account creation date
- View last login time
- Account status indicator

### Security Features
- JWT token-based authentication
- Password hashing (not stored in plain text)
- Token expiration (7 days)
- Protected routes
- CORS protection
- SQL injection prevention via SQLAlchemy ORM

## Token Management

Tokens are:
- Generated on login/register
- Stored in browser localStorage
- Automatically included in API requests via `Authorization` header
- Validated on each protected API call
- Expire after 7 days
- Checked on app load to restore session

## Testing

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "full_name": "Test User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Token Expired Error
The token expires after 7 days. Users need to login again.

### CORS Errors
Make sure `CORS_ORIGINS` in backend `.env` includes the frontend URL.

### Database Connection Error
Ensure PostgreSQL is running and `DATABASE_URL` is correctly set.

### Module Not Found Errors
Run `pip install -r requirements.txt` in the backend directory.

## Next Steps

1. Connect user assessments to user accounts
2. Add email verification
3. Implement password reset
4. Add role-based access control (admin, user, etc.)
5. Enable OAuth integration (Google, Facebook)
6. Implement two-factor authentication
