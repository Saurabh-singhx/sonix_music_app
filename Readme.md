# 🎵 Sonix — AI-Powered Music Recommendation App

Sonix is a full-stack music streaming and recommendation platform that delivers personalized song suggestions using AI. It features a modern React frontend, a Node.js/Express backend, background job processing, real-time trending tracking, and cloud-native media storage.

---

## 🚀 Features

- 🎧 **Music Streaming** — Browse, search, and play songs with a sleek in-app player
- 🤖 **AI Recommendations** — Personalized recommendations powered by Google Gemini and OpenAI
- 📈 **Trending Songs** — Cron-based trending detection updated automatically
- 🎨 **Artist & Playlist Views** — Dedicated pages for artists, playlists, and song collections
- 🔐 **Auth System** — Email/password signup + Google OAuth via Passport.js
- 📧 **OTP Verification** — Email-based OTP flow using Nodemailer
- ☁️ **Cloud Media Storage** — Songs and assets served via AWS S3 with presigned URLs
- ⚡ **Background Jobs** — Recommendation and suggestion pipelines via BullMQ + Redis
- 🛡️ **Rate Limiting** — Redis-backed rate limiting per user/IP
- 🧑‍💼 **Admin Dashboard** — Manage songs, artists, analytics, and settings

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React + TypeScript | UI framework |
| Vite | Build tool |
| Zustand | State management |
| Tailwind CSS | Styling |
| Axios | HTTP client |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express | API server |
| TypeScript | Type safety |
| Prisma + PostgreSQL | ORM & database |
| Redis | Caching, queues, rate limiting |
| BullMQ | Background job processing |
| AWS S3 | Media file storage |
| Google Gemini | AI recommendations |
| OpenAI | AI recommendations |
| Passport.js | Google OAuth |
| Nodemailer | Email / OTP delivery |
| node-cron | Scheduled jobs |
| JWT + bcrypt | Auth & password hashing |

---

## 📁 Project Structure

```
sonix_music_app/
├── client/                  # React frontend (Vite + TypeScript)
│   └── src/
│       ├── components/      # UI, section, admin, user components
│       ├── pages/           # Route-level pages
│       ├── store/           # Zustand stores (auth, player, user, admin)
│       ├── hooks/           # Custom hooks (usePlayer, etc.)
│       └── types/           # Shared TypeScript types
│
└── server/                  # Express backend (TypeScript)
    └── src/
        ├── modules/         # Route handlers (auth, user, admin, public)
        ├── services/        # Business logic (recommendation, S3, trending)
        ├── workers/         # BullMQ workers (recommendation pipeline)
        ├── queues/          # BullMQ queue definitions
        ├── cron/            # Scheduled jobs (trending, suggestions)
        ├── middleware/      # Auth middleware, rate limiter
        ├── config/          # Gemini, OpenAI, Redis, S3, Passport configs
        └── lib/             # DB client, JWT, Prisma instance
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL
- Redis
- AWS S3 bucket
- Google Gemini API key
- OpenAI API key
- Google OAuth credentials

---

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sonix

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret

# AWS S3
AWS_REGION=your_region
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=your_bucket_name

# Google Gemini
GEMINI_API_KEY=your_gemini_key

# OpenAI
OPENAI_API_KEY=your_openai_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Nodemailer
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# App
PORT=3000
CLIENT_URL=http://localhost:5173
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the dev server:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

### Docker (Backend)

A `docker-compose.yml` is provided for running the backend with PostgreSQL and Redis:

```bash
cd server
docker compose up --build
```

For development with hot reload:

```bash
docker compose -f docker-compose.dev.yml up --build
```

---

## 🧠 AI Recommendation Pipeline

1. User listening events are tracked and stored in Redis
2. BullMQ picks up recommendation jobs from the queue
3. A worker builds a taste profile and queries **Gemini** or **OpenAI**
4. Results are ranked and persisted to PostgreSQL
5. A cron job periodically refreshes suggestions and trending data

---

## 🔐 Authentication Flow

- **Email signup** → OTP sent via Nodemailer → verified → JWT issued
- **Google OAuth** → Passport.js strategy → JWT issued
- Protected routes use JWT middleware on the backend

---

## 📜 Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with `tsx` |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled output |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

---

## 🚢 CI/CD

GitHub Actions workflows are configured for both client and server under `.github/workflows/`.

---

## 📄 License

MIT