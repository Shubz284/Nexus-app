# Nexus

Nexus is a full-stack second brain for saving, organizing, and sharing information from the web. The workspace combines a React app, an Express/MongoDB backend, and a Chrome extension so users can capture content quickly and revisit it later.

## What The App Does

- Save Brain items from YouTube, Twitter/X, Instagram, Facebook, and other links.
- Organize saved content with tags and search.
- Sign in with email/password or Google OAuth.
- Write private notes with pinning, colors, tags, and search.
- Upload private documents, then edit, pin, delete, and search them.
- Share a public Brain collection with a generated link.
- Capture the current tab from the browser extension without leaving the page.

## Project Layout

- `nexus-frontend/`: React + Vite + TypeScript client.
- `Nexus-backend/`: Express + TypeScript API server.
- `nexus-extension/`: Chrome extension popup for quick saving.

## Tech Stack

| Area      | Stack                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------- |
| Frontend  | React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Zustand, React Router, TanStack Query, Axios |
| Backend   | Node.js, Express, TypeScript, MongoDB, Mongoose, Passport.js, JWT, Zod, Multer                 |
| Extension | HTML, CSS, JavaScript                                                                          |

## App Routes

- `/`: Landing page
- `/auth/*`: Login and signup flow
- `/app/dashboard`: Brain dashboard
- `/app/notes`: Notes workspace
- `/app/documents`: Document workspace
- `/share/:shareLink`: Public shared Brain view

## Backend Routes

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/refresh`
- `GET /auth/google`
- `GET /auth/google/callback`
- `GET /auth/user`
- `POST /auth/logout`
- `POST /auth/content`
- `GET /auth/content`
- `DELETE /auth/content`
- `POST /auth/brain/share`
- `GET /auth/brain/:shareLink`
- `GET /auth/preview?url=...`
- `POST /notes`
- `GET /notes`
- `GET /notes/:noteId`
- `PUT /notes/:noteId`
- `DELETE /notes/:noteId`
- `PATCH /notes/:noteId/toggle-pin`
- `GET /notes/search/query?q=...`
- `POST /documents`
- `GET /documents`
- `GET /documents/:documentId`
- `PUT /documents/:documentId`
- `DELETE /documents/:documentId`
- `PATCH /documents/:documentId/toggle-pin`
- `GET /documents/search/query?q=...`

## Requirements

- Node.js 18 or newer
- npm
- MongoDB locally or via MongoDB Atlas

## Local Setup

### Backend

```sh
cd Nexus-backend
npm install
npm run build
npm run dev
```

Create a `.env` file in `Nexus-backend` with at least these values:

- `MONGO_URI`
- `PORT`
- `SESSION_SECRET`
- `ACCESS_KEY`
- `REFRESH_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `FRONTEND_URI`
- `EXTENSION_ORIGIN` optional, for a fixed extension origin in production
- `NODE_ENV`

### Frontend

```sh
cd ../nexus-frontend
npm install
npm run dev
```

Set `VITE_SERVER_URL` in `nexus-frontend/.env` to the backend URL, for example `http://localhost:3000`.

Useful frontend scripts:

- `npm run build`
- `npm run lint`
- `npm run preview`

### Chrome Extension

1. Open `chrome://extensions` in Chrome.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select the `nexus-extension` folder.
5. Pin the extension if you want easier access.

The popup auto-fills the current tab title, URL, and content type, then sends `POST /auth/content` with browser cookies. You need to be logged in to Nexus for saves to work.

## Common Workflow

1. Sign in with email/password or Google.
2. Save Brain content from the dashboard or the extension.
3. Create notes or upload documents from the authenticated app.
4. Search, pin, and organize items as needed.
5. Share a Brain collection when you want a public link.

## Notes

- The backend serves uploaded files from `/uploads`.
- The frontend has a landing page and a dedicated shared Brain route.
- The extension README contains extra notes specific to browser setup.
