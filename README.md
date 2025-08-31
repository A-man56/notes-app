# Notes

A simple notes app with OTP-based auth (no passwords) and optional Google sign-in. Backend: Node/Express + MongoDB (Atlas). Frontend: React (Vite).

## Quick Start

- Requirements: Node 18+, a MongoDB Atlas URI, a Gmail App Password (for OTP emails), and a Google Client ID.

### 1) Backend

- Path: project/backend

1. Copy env
   - Create .env in project/backend with:
     - MONGODB_URI=your-atlas-uri
     - JWT_SECRET=use-a-long-random-string
     - PORT=5000
     - NODE_ENV=development
     - FRONTEND_URL=http://localhost:5173
     - CORS_ORIGIN=http://localhost:5173
     - EMAIL_HOST=smtp.gmail.com
     - EMAIL_PORT=587
     - EMAIL_SECURE=false
     - EMAIL_USER=your@gmail.com
     - EMAIL_PASS=your-gmail-app-password
     - EMAIL_FROM="HD App <your@gmail.com>"
     - GOOGLE_CLIENT_ID=your-google-client-id
     - OTP_EXP_MINUTES=10

2. Install + run
   - npm install
   - npm run dev

The server runs on http://localhost:5000 (API at /api).

### 2) Frontend

- Path: project/frontend

1. Copy env
   - Create .env in project/frontend with:
     - VITE_API_BASE_URL=http://localhost:5000/api
     - VITE_GOOGLE_CLIENT_ID=your-google-client-id

2. Install + run
   - npm install
   - npm run dev

The app runs on http://localhost:5173.

## Usage

- Sign Up: Name + DOB + Email → Get OTP (email).
- Sign In: Email → Get OTP → enter OTP → Sign in.
- Resend OTP: enabled after 60s; generates a fresh OTP each time.
- Google: “Continue with Google” also signs you in and creates the account if needed.

## Build & Production

- Backend (from project/backend):
  - npm run build
  - npm run start
- Frontend (from project/frontend):
  - npm run build
  - npm run preview (local) or serve the dist/ via your host.

## Troubleshooting

- No email? Ensure Gmail App Password is used (not your normal password), EMAIL_* vars match, and restart the server.
- 401/403? Check JWT_SECRET matches and the frontend is calling VITE_API_BASE_URL correctly.
- Connection refused? Make sure backend is running on port 5000 and CORS/FRONTEND_URL point to http://localhost:5173.
