# Nexus

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8-880000?logo=mongoose&logoColor=white)
![Passport](https://img.shields.io/badge/Passport-JWT%20%2B%20OAuth-34E27A?logo=passport&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-AI-F55036)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)

A full-stack second brain for saving, organizing, and sharing web content, notes, and documents — with AI-powered search insights and a Chrome extension for quick capture.

## Features

- User registration and login (JWT + Google OAuth)
- **Brain** — save links from YouTube, Twitter/X, Instagram, Facebook, and other URLs
- Filter Brain content by type, search by title or tags, and preview URLs via Open Graph
- AI explain summaries on Brain search (Groq, debounced)
- Share Brain collections with a public hash link
- **Notes** — create, edit, delete, pin, color-code, tag, and search private notes
- **Documents** — upload PDF/DOC/DOCX (up to 50 MB), edit metadata, pin, delete, and search
- Responsive card-based dashboard with sidebar navigation
- Chrome extension to quick-save the current tab without leaving the page

## Tech Stack

| Layer | Technologies |
| ----- | ------------ |
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS 4, shadcn/ui (Radix UI), React Router 7, TanStack Query, Zustand, Axios, Sonner, React Hook Form, Zod, Lucide React, date-fns |
| Backend | Node.js, Express 5, TypeScript, MongoDB, Mongoose, Passport.js (JWT + Google OAuth), bcrypt, Zod, Multer, cookie-parser, express-session, jsonwebtoken, OpenAI SDK (Groq-compatible), cors |
| Extension | Chrome Manifest V3, HTML, CSS, JavaScript |
| AI | Groq API (`llama-3.3-70b-versatile`) |
| Deploy | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## Project Structure

```
Week-15-Project/
├── nexus-frontend/        # React + Vite SPA
│   └── src/
│       ├── api/           # Axios instance + interceptors
│       ├── components/    # shadcn/ui primitives
│       ├── components_Custom/  # Cards, modals, sidebar
│       ├── hooks/         # useContent, useNotes, useDocuments
│       ├── pages/         # Dashboard, Notes, Documents, Auth
│       └── store/         # Zustand + TanStack Query
├── Nexus-backend/         # Express REST API
│   └── src/
│       ├── config/        # Passport, nodemailer
│       ├── controllers/   # auth, notes, documents, oauth
│       ├── middlewares/   # errorHandler, refreshMiddleware
│       ├── routes/        # auth, oauth, notes, documents, ai
│       ├── schema/        # Zod validation
│       ├── services/      # aiExplainService (Groq)
│       └── db.ts          # Mongoose models
├── nexus-extension/       # Chrome MV3 quick-save popup
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google OAuth credentials (for Google sign-in)
- Groq API key (optional — for AI explain)

### Backend Setup

```sh
cd Nexus-backend
npm install
cp .env.example .env
# Edit .env with MONGO_URI, JWT secrets, Google OAuth, FRONTEND_URI
npm run dev
```

Server runs on `http://localhost:3000`.

**Required `.env` variables:** `MONGO_URI`, `PORT`, `SESSION_SECRET`, `ACCESS_KEY`, `REFRESH_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `FRONTEND_URI`

**Optional:** `GROQ_API_KEY`, `GROQ_MODEL`, `EXTENSION_ORIGIN`, `NODE_ENV`

> AI uses **Groq** (`GROQ_API_KEY`), not Gemini. Update `.env` if copying from `.env.example`.

### Frontend Setup

```sh
cd nexus-frontend
npm install
```

Create `.env`:

```env
VITE_SERVER_URL=http://localhost:3000
VITE_APP_URL=http://localhost:5173
```

```sh
npm run dev
```

App runs on `http://localhost:5173`.

### Chrome Extension Setup

1. Open `chrome://extensions` and enable **Developer mode**
2. Click **Load unpacked** and select the `nexus-extension` folder
3. Log in to Nexus in the same browser before saving from the popup

See [`nexus-extension/README.md`](nexus-extension/README.md) for details.

## API Reference

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/auth/signup` | Register user |
| POST | `/auth/login` | Login, set JWT cookies |
| GET | `/auth/refresh` | Refresh access token |
| GET | `/auth/user` | Get user profile |
| POST | `/auth/logout` | Clear cookies |
| GET | `/auth/google` | Start Google OAuth |
| GET | `/auth/google/callback` | OAuth callback |
| POST | `/auth/content` | Add Brain content |
| GET | `/auth/content` | List Brain content |
| DELETE | `/auth/content` | Delete Brain content |
| POST | `/auth/brain/share` | Enable/disable public share link |
| GET | `/auth/brain/:shareLink` | Public shared Brain (no auth) |
| GET | `/auth/preview?url=` | URL Open Graph preview |
| POST | `/notes` | Create note |
| GET | `/notes` | List notes |
| GET | `/notes/:noteId` | Get note |
| PUT | `/notes/:noteId` | Update note |
| DELETE | `/notes/:noteId` | Delete note |
| PATCH | `/notes/:noteId/toggle-pin` | Pin/unpin note |
| GET | `/notes/search/query?q=` | Search notes |
| POST | `/documents` | Upload document (multipart) |
| GET | `/documents` | List documents |
| GET | `/documents/:documentId` | Get document |
| PUT | `/documents/:documentId` | Update document metadata |
| DELETE | `/documents/:documentId` | Delete document |
| PATCH | `/documents/:documentId/toggle-pin` | Pin/unpin document |
| GET | `/documents/search/query?q=` | Search documents |
| POST | `/ai/explain` | AI summary for Brain search query |

Protected routes use JWT via httpOnly cookies (`withCredentials: true`). Brain content creation also requires the `X-Nexus-Client` header (`web` or `extension`).

## Deployment

### Backend (Render)

1. Connect this repo and set root directory to `Nexus-backend`
2. **Build:** `npm install` | **Start:** `npm start`
3. Set `MONGO_URI`, `ACCESS_KEY`, `REFRESH_KEY`, `SESSION_SECRET`, Google OAuth vars, and `FRONTEND_URI` in environment variables
4. Set `NODE_ENV=production` for secure cookies

### Frontend (Vercel)

1. Connect this repo and set root directory to `nexus-frontend`
2. Set `VITE_SERVER_URL` to your deployed backend URL
3. Set `VITE_APP_URL` to your deployed frontend URL
4. Deploy — add a `vercel.json` with SPA rewrites if needed for client-side routing

### Chrome Extension (Production)

Set `EXTENSION_ORIGIN=chrome-extension://<your-extension-id>` in the backend environment and update `host_permissions` in `nexus-extension/manifest.json` to your production URLs.

## License

ISC
