# 🚀 JobScrapper AI — AI-Powered Job Search Platform

A full-stack job search and scraping web application built with React, Tailwind CSS, Node.js, Neon DB (PostgreSQL), AWS S3, and OpenAI.

## Features

- 🔍 **Multi-Platform Scraping** — Scrape jobs from LinkedIn, Naukri, Internshala & Unstop
- 🤖 **AI-Powered Insights** — Job summaries, skill extraction, compatibility scoring
- 📋 **Application Tracking** — Track applied jobs with status updates
- 👤 **Profile Management** — CRUD operations, image upload to S3
- 🔐 **Secure Auth** — JWT-based authentication with signup/login
- 💬 **AI Assistant** — Chat-based career guidance
- 📱 **Responsive Design** — Works on desktop, tablet & mobile

## Tech Stack

| Layer    | Technology                                                  |
| -------- | ----------------------------------------------------------- |
| Frontend | React 18, Tailwind CSS 3, Vite, Framer Motion, Lucide Icons |
| Backend  | Node.js, Express 4, JWT, bcryptjs                           |
| Database | Neon DB (PostgreSQL)                                        |
| Storage  | AWS S3                                                      |
| AI       | OpenAI GPT-3.5                                              |

## Project Structure

```
├── backend/
│   ├── server.js          # Express entry point
│   ├── db/                # Schema & connection
│   ├── middleware/         # JWT auth
│   ├── routes/            # API routes
│   ├── services/          # Scraper, AI, S3
│   └── utils/             # Helpers
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth context
│   │   └── api/           # Axios client
│   └── ...config files
```

## Setup & Run

### 1. Backend

```bash
cd backend
cp .env.example .env   # Fill in your credentials
npm install
npm run dev
```

### 2. Database

Run `backend/db/schema.sql` against your Neon DB to create tables.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable                | Description                          |
| ----------------------- | ------------------------------------ |
| `DATABASE_URL`          | Neon DB PostgreSQL connection string |
| `JWT_SECRET`            | Secret key for JWT signing           |
| `AWS_ACCESS_KEY_ID`     | AWS S3 access key                    |
| `AWS_SECRET_ACCESS_KEY` | AWS S3 secret key                    |
| `AWS_BUCKET_NAME`       | S3 bucket name                       |
| `AWS_REGION`            | AWS region                           |
| `OPENAI_API_KEY`        | OpenAI API key for AI features       |

## API Endpoints

| Method      | Endpoint             | Description                     |
| ----------- | -------------------- | ------------------------------- |
| POST        | `/api/auth/signup`   | Register new user               |
| POST        | `/api/auth/login`    | Login, returns JWT              |
| GET         | `/api/auth/me`       | Get current user                |
| POST        | `/api/jobs/scrape`   | Scrape jobs by keyword/location |
| GET         | `/api/jobs`          | Get jobs with filters           |
| POST        | `/api/applications`  | Apply to a job                  |
| GET         | `/api/applications`  | Get application history         |
| GET/PUT     | `/api/profile`       | Get/update profile              |
| POST/DELETE | `/api/profile/image` | Upload/delete profile image     |
| POST        | `/api/ai/summarize`  | Summarize job description       |
| POST        | `/api/ai/skills`     | Extract skills from job         |
| POST        | `/api/ai/match`      | Match job to profile            |
| POST        | `/api/ai/recommend`  | Get recommendations             |
| POST        | `/api/ai/chat`       | AI assistant chat               |
