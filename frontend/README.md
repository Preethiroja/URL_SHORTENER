# Linksy 🔗

A full-stack URL Shortener and Analytics Platform that allows users to create, manage, and track shortened URLs with advanced analytics, QR code generation, bulk URL shortening, and public statistics pages.

## Live Demo

Frontend: https://url-shortener-psi-eosin.vercel.app/

Backend API: https://url-shortener-j2ye.onrender.com

## Demo Video

Loom / YouTube Video:
https://your-video-link

---

# Features

## URL Management
- Create shortened URLs
- Custom aliases for URLs
- Edit destination URLs
- Delete URLs
- Set expiry dates for links

## Analytics
- Total click count
- Last visited timestamp
- Recent visit history
- Device analytics
- Browser analytics
- Daily click trend charts
- Public statistics page

## QR Code Support
- Generate QR code for every shortened URL
- Download QR code image

## Bulk Operations
- Bulk URL shortening using CSV upload

## Authentication & Security
- User registration
- User login
- Google OAuth login
- JWT authentication
- Password reset via email
- Password hashing using bcrypt

---

# Tech Stack

## Frontend
- React.js
- Vite
- React Router DOM
- Lucide React
- Recharts

## Backend
- Node.js
- Express.js

## Database
- MongoDB Atlas
- Mongoose

## Authentication
- JWT
- Google OAuth
- bcrypt

## Deployment
- Frontend: Vercel
- Backend: Render

---

# Setup Instructions

## Prerequisites

Install:

- Node.js (v18+ recommended)
- npm
- MongoDB Atlas account

---

## Clone Repository

```bash
git clone https://github.com/Preethiroja/URL_SHORTENER.git

cd URL_SHORTENER
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

Frontend runs at:

```text
http://localhost:5173
```

---

# Backend Setup

```bash
cd backend

npm install

npm start
```

Create `.env` file:

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

JWT_SECRET=YOUR_SECRET_KEY

FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID

EMAIL_USER=YOUR_EMAIL

EMAIL_PASS=YOUR_EMAIL_APP_PASSWORD
```

Backend runs at:

```text
http://localhost:5000
```

---

# Project Structure

```text
URL_SHORTENER
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── assets
│
├── backend
│   ├── config
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
└── README.md
```

---

# Assumptions Made

1. Users must be authenticated to create and manage URLs.
2. Public statistics pages can be viewed without authentication.
3. Each shortened URL is unique.
4. Expired URLs are no longer accessible after the configured expiry date.
5. CSV files contain a column named `url`.
6. Analytics are recorded whenever a visitor accesses a short URL.
7. Google OAuth users receive automatically generated usernames if none exist.

---

# AI Planning Document

## Problem Statement

Users often need a simple way to shorten links while also tracking visitor engagement and managing large volumes of URLs efficiently.

## Solution

Linksy provides:

- URL shortening
- Analytics tracking
- QR code generation
- Bulk URL imports
- Public statistics sharing
- Secure authentication

---

# Architecture Diagram

```text
┌─────────────────────┐
│      Frontend       │
│      React.js       │
│       Vite          │
└──────────┬──────────┘
           │
           │ HTTP Requests
           ▼
┌─────────────────────┐
│      Backend        │
│   Node.js/Express   │
└──────────┬──────────┘
           │
           │ Mongoose
           ▼
┌─────────────────────┐
│   MongoDB Atlas     │
│ Users, URLs, Visits │
└─────────────────────┘

Authentication:
Frontend → JWT → Backend

Analytics:
Redirect Route → Visit Tracking → Database → Dashboard

Bulk Upload:
CSV → Backend Processing → URL Generation → Database
```

---

# API Overview

## Authentication

```text
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/google
POST /api/auth/forgot-password
PUT  /api/auth/reset-password/:token
GET  /api/auth/me
PUT  /api/auth/me
```

## URL Management

```text
POST   /api/url/shorten
POST   /api/url/bulk
GET    /api/url
PUT    /api/url/:id
DELETE /api/url/:id
```

## Analytics

```text
GET /api/url/:id/analytics
GET /api/url/public-stats/:id
```
<img width="1627" height="908" alt="Screenshot 2026-06-03 224439" src="https://github.com/user-attachments/assets/55a6e180-cc0b-463d-8d69-6c4d6f322f42" />

---


# Author

**Preethi Roja**

GitHub:
https://github.com/Preethiroja

---

This project is a part of a hackathon run by https://katomaran.com
