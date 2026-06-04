# Linksy 🔗

A full-stack URL Shortener and Analytics Platform that allows users to create, manage, and track shortened URLs with advanced analytics, QR code generation, bulk URL shortening, and public statistics pages.

## Live Demo

* **Frontend:** https://url-shortener-psi-eosin.vercel.app/
* **Backend API:** https://url-shortener-j2ye.onrender.com

## Demo Video

* **Loom Video:** [https://www.loom.com/share/cff8a7b9f5434bc68a4ca78b185bc6be](https://www.loom.com/share/834345a75ff540709e3b8060b6ef7ab1)

## Documentation

📄 **Project Documentation (AI Development Workflow, System Design, Features & Architecture):**  
https://drive.google.com/file/d/1sPDrY_Ox2XTcQq2oioOMLdLSQeBhS5BD/view?usp=sharing

> This document contains complete AI-assisted development workflow, including planning, requirement analysis, system design, feature engineering, and deployment strategy.
---

# Features

## URL Management

* Create shortened URLs
* Custom aliases for URLs
* Edit destination URLs
* Delete URLs
* Set expiry dates for links

## Analytics

* Total click count
* Last visited timestamp
* Recent visit history
* Device analytics
* Browser analytics
* Daily click trend charts
* Public statistics page

## QR Code Support

* Generate QR codes for shortened URLs
* Download QR code images

## Bulk Operations

* Bulk URL shortening using CSV upload

## Authentication & Security

* User registration
* User login
* Google OAuth login
* JWT authentication
* Password reset via email
* Password hashing using bcrypt

---

# Tech Stack

## Frontend

* React.js
* Vite
* React Router DOM
* Lucide React
* Recharts

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas
* Mongoose

## Authentication

* JWT
* Google OAuth
* bcrypt

## Deployment

* Frontend: Vercel
* Backend: Render

---

# Setup Instructions

## Prerequisites

Install the following:

* Node.js (v18+ recommended)
* npm
* MongoDB Atlas account

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

Create a `.env` file inside the frontend directory:

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

Create a `.env` file inside the backend directory:

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
4. Expired URLs become inaccessible after the configured expiry date.
5. CSV uploads contain a column named `url`.
6. Analytics are recorded whenever a visitor accesses a shortened URL.
7. Google OAuth users receive automatically generated usernames if none exist.

---

# AI Planning Document

## Problem Statement

Users often need a simple way to shorten links while also tracking visitor engagement and managing large volumes of URLs efficiently.

## Solution

Linksy provides:

* URL shortening
* Analytics tracking
* QR code generation
* Bulk URL imports
* Public statistics sharing
* Secure authentication

---

# Architecture Diagram

```text
┌───────────────────────────────────────────────┐
│                   Users                       │
└───────────────────┬───────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────┐
│                React Frontend                 │
│                 (Vite + React)                │
│                                               │
│ • Dashboard                                   │
│ • URL Management                              │
│ • Analytics Visualization                     │
│ • QR Code Generation                          │
│ • Profile Management                          │
└───────────────────┬───────────────────────────┘
                    │
                    │ REST API / JWT
                    ▼
┌───────────────────────────────────────────────┐
│            Node.js + Express Backend          │
├───────────────────────────────────────────────┤
│ Authentication Module                         │
│ • JWT Authentication                          │
│ • Google OAuth                                │
│ • Password Reset                              │
│                                               │
│ URL Management Module                         │
│ • Create Short URLs                           │
│ • Custom Aliases                              │
│ • Edit/Delete URLs                            │
│ • Expiry Management                           │
│                                               │
│ Analytics Module                              │
│ • Click Tracking                              │
│ • Device Detection                            │
│ • Browser Analytics                           │
│ • Visit History                               │
│                                               │
│ Bulk Upload Module                            │
│ • CSV Processing                              │
│ • Bulk URL Creation                           │
└───────────────────┬───────────────────────────┘
                    │
                    │ Mongoose ODM
                    ▼
┌───────────────────────────────────────────────┐
│                MongoDB Atlas                  │
├───────────────────────────────────────────────┤
│ Collections                                   │
│ • Users                                       │
│ • URLs                                        │
│ • Analytics                                   │
│ • Password Reset Tokens                       │
└───────────────────────────────────────────────┘
```

### Authentication Flow

```text
Frontend → JWT → Backend → MongoDB
```

### Analytics Flow

```text
Short URL Access → Redirect Route → Visit Tracking → Database → Dashboard
```

### Bulk Upload Flow

```text
CSV Upload → Backend Processing → URL Generation → Database
```

---

# Application Screenshots

<details>
<summary>View Screenshots</summary>

<br>
<h4>Home Page<h4>
<p align="center">
<img src="https://github.com/user-attachments/assets/55a6e180-cc0b-463d-8d69-6c4d6f322f42" width="900"/>
</p>
<h4>Dashboard<h4>
<p align="center">
<img src="https://github.com/user-attachments/assets/77cc638f-c4bb-4307-a167-fd5eb49e735a" width="900"/>
</p>
<h4>Bulk URL Shortening<h4>
<p align="center">
<img src="https://github.com/user-attachments/assets/7c9539bc-3351-45b7-8a31-f5df08e49ef3" width="900"/>
</p>
<h4>Analytics Page<h4>
<p align="center">
<img src="https://github.com/user-attachments/assets/cfe7ca77-2fcd-4e4d-b983-9f9f16d05a05" width="900"/>
</p>
<h4>Public stats page<h4>
<p align="center">
<img src="https://github.com/user-attachments/assets/1fca29e5-37da-4065-a406-d3e106e38080" width="900"/>
</p>
<h4>QR Code page<h4>
<p align="center">
<img src="https://github.com/user-attachments/assets/8f2c8912-96b3-448a-a4ea-5542cd0f1a38" width="900"/>
</p>

</details>

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

---

# Author

**Preethi Roja**

GitHub: https://github.com/Preethiroja

---

This project is a part of a hackathon run by https://katomaran.com
