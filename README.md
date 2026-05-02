# Nexus - Second Brain Platform

Nexus is a second-brain productivity platform built to help users capture, organize, and revisit information from multiple places in one centralized workspace. It combines a content dashboard, notes, documents, and a browser extension so users can save important knowledge without switching between tools.

The core idea behind Nexus is simple: anything valuable you discover online or create yourself should be easy to store and even easier to find later. The application gives users a structured way to manage saved links, notes, and uploaded files with consistent search, tagging, pinning, and sharing behavior.

At a high level, Nexus lets users:

- Save and organize social content from YouTube, Twitter/X, Instagram, and Facebook
- Create personal notes with tags, colors, pinning, and search
- Upload and manage documents such as PDF, DOC, and DOCX files
- Share Brain content with a generated public link
- Capture content quickly from a Chrome extension

This repository is organized as a monorepo containing the backend API, frontend application, and extension code in one place, which keeps the full product easy to develop and maintain.

## Project Description

Nexus was designed as a practical second-brain system for people who collect a lot of information but do not want that information scattered across bookmarks, note apps, download folders, and browser tabs. Instead of treating saved content as disconnected items, Nexus structures everything into searchable collections with rich metadata.

The application currently supports three major knowledge buckets:

1. **Brain** - for saved web content such as social posts and links
2. **Notes** - for short-form personal writing and task-related ideas
3. **Documents** - for uploaded files that need to be preserved and organized

Each bucket follows a similar experience pattern: create, view, search, update, pin, and delete. This makes the product feel consistent and predictable while still allowing each section to handle its own content type.

## What Problem It Solves

Modern users save information in too many places. A useful post might be bookmarked in the browser, a thought may sit in a messaging app, a PDF might be lost in downloads, and a note may exist in a separate editor. Nexus addresses that fragmentation by giving users one structured workspace for all of those items.

The result is:

- Faster recall of saved information
- Better organization through tags and pinning
- Cleaner separation between social content, notes, and documents
- A more intentional way to build a personal knowledge system

## How the App Works

The system is split into three layers:

- **Backend**: Express + TypeScript API with MongoDB persistence, JWT auth, and file upload handling
- **Frontend**: React + Vite UI with page-based navigation, modal-driven workflows, and live search
- **Extension**: Chrome extension that sends the current tab to the backend for quick saving

The backend is responsible for authentication, data validation, database operations, file uploads, and share-link generation. The frontend focuses on user interaction, state management, and a clean visual workflow. The extension acts as a lightweight input channel that pushes content into the Brain section.

## Typical User Flow

1. The user signs in with email/password or Google OAuth.
2. The user opens the dashboard and starts adding content.
3. Social links can be saved directly into Brain.
4. Notes can be written inside the Notes page and organized using color and tags.
5. Documents can be uploaded into the Documents page and managed separately.
6. The user can search, pin, edit, and delete items in each section.
7. The Brain can be shared through a public hash link when needed.

## Current Product Scope

Nexus currently focuses on privacy-aware personal organization rather than public collaboration. By default, the public share flow exposes Brain content, while Notes and Documents remain private sections for personal use.

This makes the app suitable for:

- Personal knowledge management
- Content collection and curation
- Exam or course note storage
- Uploading reference files
- Quick bookmarking from the browser

## Monorepo Structure

```text
Week-15-Project/
|- Nexus-backend/      # Express + TypeScript + MongoDB API
|- nexus-frontend/     # React + TypeScript + Vite web app
|- nexus-extension/    # Chrome extension (quick save)
|- PROJECT_ANALYSIS.md
|- IMPLEMENTATION_SUMMARY.md
|- NOTES_FEATURE_DOCUMENTATION.md
```

## Tech Stack

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB + Mongoose
- Passport (JWT + Google OAuth)
- Zod (validation)
- Multer (document upload)
- Cookie-based auth session flow

### Frontend

- React 19 + TypeScript
- Vite
- React Router
- Axios
- Zustand
- TanStack Query
- Tailwind CSS
- Sonner (toasts)
- Radix UI primitives

### Extension

- Chrome Extension (Manifest V3)
- Quick-save current tab to Nexus backend

## Implemented Modules

## 1) Authentication

### Local Auth

- Signup with strong password validation
- Login with JWT cookies (`accessToken`, `refreshToken`)
- Logout clears auth cookies

### Google OAuth

- Google login flow via Passport strategy
- Redirect back to frontend dashboard on success

### Token Refresh

- Refresh endpoint issues a new access token when refresh token is valid

## 2) Brain (Social Content)

Users can add and manage content links with tags and type.

Features:

- Add content item
- Fetch all user content
- Delete content
- Share brain via generated public hash link
- Public endpoint to view shared brain
- URL preview metadata extraction (`og:image`, title, description)

## 3) Notes Section

Dedicated Notes page under Main navigation.

Features:

- Create note
- View all notes
- Update note
- Delete note
- Pin / unpin note
- Search notes
- Tag support (auto create/reuse tag model)
- Color-coded notes

Notes are user-isolated and protected by JWT auth.

## 4) Documents Section

Dedicated Documents page under Main navigation.

Features:

- Upload document
- View all documents
- Update title/description/tags
- Delete document
- Pin / unpin document
- Search documents by title/description/original file name

### Upload Rules

- Allowed types:
  - PDF (`application/pdf`)
  - DOC (`application/msword`)
  - DOCX (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
- Max file size: 50 MB
- Files saved to backend `uploads/` directory
- Files served statically from `/uploads`

## 5) Chrome Extension (Quick Save)

The extension allows saving the current browser tab directly to Nexus:

- Auto-filled title
- Auto-filled link
- Auto-detected type
- Optional tags

Requires user to be logged into Nexus in the browser so cookie auth is available.

## Data Models

### User

- `userName`
- `email`
- `password` (local auth)
- `googleId` (google auth)
- `authProvider`
- `profilePictureUrl`
- `isEmailPlaceholder`
- timestamps

### Content

- `title`
- `link`
- `type`
- `tags[]`
- `userId`
- optional file metadata fields

### Note

- `title`
- `content`
- `tags[]`
- `color`
- `isPinned`
- `userId`
- timestamps

### Document

- `title`
- `filename`
- `originalName`
- `mimetype`
- `size`
- `description`
- `tags[]`
- `isPinned`
- `userId`
- timestamps

### Tag

- `title` (unique)

### Share Link

- `hash`
- `userId`

## API Overview

## Auth Routes (`/auth`)

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/refresh`
- `GET /auth/google`
- `GET /auth/google/callback`
- `GET /auth/user`
- `POST /auth/logout`

## Brain Content Routes (`/auth`)

- `POST /auth/content`
- `GET /auth/content`
- `DELETE /auth/content`

## Brain Sharing (`/auth`)

- `POST /auth/brain/share`
- `GET /auth/brain/:shareLink`

## Metadata Preview (`/auth`)

- `GET /auth/preview?url=...`

## Notes Routes (`/notes`)

- `POST /notes`
- `GET /notes`
- `GET /notes/:noteId`
- `PUT /notes/:noteId`
- `DELETE /notes/:noteId`
- `PATCH /notes/:noteId/toggle-pin`
- `GET /notes/search/query?q=...`

## Document Routes (`/documents`)

- `POST /documents` (multipart form-data, field name: `document`)
- `GET /documents`
- `GET /documents/:documentId`
- `PUT /documents/:documentId`
- `DELETE /documents/:documentId`
- `PATCH /documents/:documentId/toggle-pin`
- `GET /documents/search/query?q=...`

## Environment Variables

Create a `.env` in `Nexus-backend/`:

```env
MONGO_URI=
PORT=3000
SESSION_SECRET=
ACCESS_KEY=
REFRESH_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
FRONTEND_URI=http://localhost:5173
EXTENSION_ORIGIN=chrome-extension://<extension-id>
NODE_ENV=development
```

## Local Setup

## 1) Clone and install dependencies

Backend:

```bash
cd Nexus-backend
npm install
```

Frontend:

```bash
cd ../nexus-frontend
npm install
```

Extension:

- No package install required for current phase.

## 2) Start backend

```bash
cd Nexus-backend
npm run dev
```

Backend defaults to `http://localhost:3000`.

## 3) Start frontend

```bash
cd nexus-frontend
npm run dev
```

Frontend defaults to `http://localhost:5173`.

## 4) Load extension in Chrome

1. Open `chrome://extensions`
2. Enable Developer mode
3. Click Load unpacked
4. Select `nexus-extension`

## Build Commands

Backend:

```bash
cd Nexus-backend
npm run build
npm run start
```

Frontend:

```bash
cd nexus-frontend
npm run build
npm run preview
```

## Current Sharing Behavior

At present, share links expose Brain content only.
Notes and Documents are private and not included in shared links by default.

## Security and Access Control

- JWT-based route protection via Passport
- Cookie-based auth tokens
- User-level data isolation on all protected routes
- Input validation with Zod
- File upload validation (mime type + size limit)

## Troubleshooting

## Frontend build/runtime parsing errors

- If Vite shows an unexpected token in a component, check for partial or conflicting merges in that file.
- Restart frontend after fixing syntax:

```bash
cd nexus-frontend
npm run dev
```

## Backend TypeScript errors

- Run:

```bash
cd Nexus-backend
npm run build
```

- Fix strict type issues (especially around Mongoose inferred types) before restarting dev server.

## Upload issues

- Ensure backend is running and `/uploads` static route is active
- Ensure file type is PDF/DOC/DOCX and file is under 50MB
- Ensure user is authenticated

## Roadmap

- Optional share scopes (Brain only / include Notes / include Documents)
- Better typed backend model interfaces
- Improved preview extraction reliability
- Document preview thumbnails
- Unified global search across Brain, Notes, and Documents

---

If you are developing this project further, keep this README as the source of truth for architecture, module boundaries, and setup flow.
