# Week-15-Project: Nexus - Complete Project Analysis

## 📋 Project Overview

**Nexus** is a full-stack content management application that allows users to save, organize, and share content from various social media platforms (YouTube, Twitter, Instagram, Facebook). The project consists of a TypeScript/Express backend and a React/TypeScript frontend.

---

## 🏗️ Architecture

### **Tech Stack**

#### Backend (`Nexus-backend/`)
- **Runtime**: Node.js with Express.js 5.1.0
- **Language**: TypeScript 5.8.3
- **Database**: MongoDB with Mongoose 8.16.5
- **Authentication**: 
  - Passport.js with JWT strategy
  - Google OAuth 2.0
  - Bcrypt for password hashing
- **Validation**: Zod 4.1.4
- **Session Management**: express-session with cookie-based tokens

#### Frontend (`nexus-frontend/`)
- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.0
- **Routing**: React Router DOM 7.8.2
- **State Management**: 
  - Zustand 5.0.8 (for user preferences)
  - TanStack Query 5.87.4 (for server state)
- **Styling**: Tailwind CSS 4.1.11
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form 7.62.0 with Zod validation
- **HTTP Client**: Axios 1.11.0
- **Notifications**: Sonner 2.0.7

---

## 📁 Project Structure

```
Week-15-Project/
├── Nexus-backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── nodeMailer.ts      # Email configuration (commented out)
│   │   │   └── passport.ts        # Passport strategies (JWT, Google OAuth)
│   │   ├── middlewares/
│   │   │   ├── errorHandler.ts    # Centralized error handling
│   │   │   └── refreshMiddleware.ts # Refresh token validation
│   │   ├── routes/
│   │   │   └── authRoutes.ts      # All API endpoints
│   │   ├── schema/                # (Empty - schemas in db.ts)
│   │   ├── types/
│   │   │   └── types.ts           # TypeScript type definitions
│   │   ├── utils/
│   │   │   ├── appError.ts        # Custom error class
│   │   │   ├── asyncWrap.ts      # Async error wrapper
│   │   │   └── utils.ts           # Utility functions
│   │   ├── db.ts                  # Mongoose schemas and models
│   │   └── index.ts               # Express app setup
│   ├── dist/                      # Compiled JavaScript output
│   └── package.json
│
└── nexus-frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.ts           # Axios instance with interceptors
    │   ├── components/
    │   │   ├── auth/
    │   │   │   ├── LoginForm.tsx
    │   │   │   └── SignupForm.tsx
    │   │   ├── ui/                # Radix UI components
    │   │   └── GlobalErrorBoundry.tsx
    │   ├── components_Custom/
    │   │   ├── AppSidebar.tsx
    │   │   ├── Cards.tsx
    │   │   ├── ContentModal.tsx
    │   │   ├── SearchBar.tsx
    │   │   └── UserProfile.tsx
    │   ├── hooks/
    │   │   └── useContent.tsx     # Content fetching hook
    │   ├── pages/
    │   │   ├── Dashboard.tsx
    │   │   ├── Loginpage.tsx
    │   │   ├── SignupPage.tsx
    │   │   └── NotFound.tsx
    │   ├── routes/
    │   │   ├── AppRoutes.tsx      # Protected routes
    │   │   ├── AuthRoutes.tsx     # Public auth routes
    │   │   └── index.tsx          # Router configuration
    │   ├── store/
    │   │   └── userStore.ts       # Zustand store + TanStack Query hooks
    │   ├── utils/
    │   │   └── errorHandler.ts    # Frontend error handling
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

---

## 🔐 Authentication System

### **Backend Authentication Flow**

1. **Local Authentication (Email/Password)**
   - Signup: Validates with Zod, hashes password with bcrypt, creates user
   - Login: Validates credentials, issues JWT access + refresh tokens
   - Tokens stored in httpOnly cookies

2. **Google OAuth**
   - Uses Passport Google Strategy
   - Handles existing email conflicts gracefully
   - Creates user or links to existing Google account

3. **JWT Token Strategy**
   - **Access Token**: Short-lived (24h on login, 1h on refresh), signed with `ACCESS_KEY`
   - **Refresh Token**: Long-lived (7d on login, 15d on Google), signed with `REFRESH_KEY`
   - Two Passport strategies: `jwt-access` and `jwt-refresh`
   - Token extraction from cookies or Authorization header

4. **Token Refresh Endpoint**
   - `/auth/refresh` - Validates refresh token, issues new access token
   - Handles token expiration gracefully

### **Frontend Authentication**

- Axios interceptor automatically handles 401 errors
- Redirects to login on session expiration
- TanStack Query manages user data with caching
- Zustand store for user preferences

---

## 🗄️ Database Schema

### **User Model** (`userModel`)
```typescript
{
  userName: string (unique, required)
  email: string (unique, required)
  password?: string (required if authProvider === "local")
  googleId?: string (unique, sparse, required if authProvider === "google")
  authProvider: "google" | "local" | "facebook" | "twitter"
  profilePictureUrl?: string
  isEmailPlaceholder: boolean (default: false)
  createdAt: Date
  updatedAt: Date
}
```

### **Content Model** (`ContentModel`)
```typescript
{
  title: string (required)
  link: string
  type: string (e.g., "youtube", "twitter", "instagram", "facebook")
  userId: ObjectId (ref: "User", required)
  tags: [ObjectId] (ref: "Tag")
}
```

### **Tag Model** (`TagModel`)
```typescript
{
  title: string (unique, required)
}
```

### **Link Model** (`LinkModel`) - For sharing
```typescript
{
  hash: string (required, unique)
  userId: ObjectId (ref: "User", required, unique)
}
```

---

## 🛣️ API Endpoints

### **Authentication Routes** (`/auth`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/signup` | No | Create new user account |
| POST | `/auth/login` | No | Login with email/password |
| GET | `/auth/google` | No | Initiate Google OAuth |
| GET | `/auth/google/callback` | No | Google OAuth callback |
| GET | `/auth/refresh` | Refresh Token | Refresh access token |
| GET | `/auth/user` | Access Token | Get current user info |
| POST | `/auth/logout` | No | Clear authentication cookies |

### **Content Routes** (`/auth`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/content` | Access Token | Create new content item |
| GET | `/auth/content` | Access Token | Get user's content (with tags populated) |
| DELETE | `/auth/content` | Access Token | Delete content by ID |

### **Sharing Routes** (`/auth`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/brain/share` | Access Token | Enable/disable sharing (returns hash) |
| GET | `/auth/brain/:shareLink` | No | Get shared content by hash |

### **Utility Routes** (`/auth`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/auth/preview` | No | Extract Open Graph metadata from URL |

---

## 🎨 Frontend Features

### **Dashboard** (`Dashboard.tsx`)
- **Content Grid**: Responsive grid layout (1-4 columns based on screen size)
- **Search**: Search by title or tags
- **Filtering**: Filter by content type (all, youtube, twitter, instagram, facebook)
- **Sidebar**: Type filter sidebar (responsive, mobile overlay)
- **Actions**:
  - Add new content (opens modal)
  - Share brain (generates shareable link)
  - Delete content
- **Auto-refresh**: Content refreshes every 10 seconds

### **Content Modal** (`ContentModal.tsx`)
- Form to add new content
- Fields: Title, Link, Type (4 options), Tags
- Tag input: Supports Enter, comma, or space to add tags
- Real-time tag management

### **Authentication Pages**
- **Signup**: Username, email, password, confirm password, terms checkbox
- **Login**: Email, password, Google OAuth button
- Both use React Hook Form with Zod validation
- Server error handling with field-level error display

---

## 🔒 Security Features

### **Backend**
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT tokens in httpOnly cookies (prevents XSS)
- ✅ CORS configured with credentials
- ✅ Secure cookies in production (HTTPS only)
- ✅ Input validation with Zod
- ✅ MongoDB injection prevention (Mongoose)
- ✅ Separate access/refresh token secrets
- ✅ Token expiration handling

### **Frontend**
- ✅ Axios interceptor for automatic token refresh
- ✅ Protected routes (requires authentication)
- ✅ Error boundary for React errors
- ✅ Input sanitization via Zod schemas

---

## 🐛 Issues & Observations

### **Potential Issues**

1. **Hardcoded URLs**
   - `axios.ts`: `BASE_URL = 'http://localhost:3000'` (should use env variable)
   - `Dashboard.tsx`: Share URL hardcoded to `localhost:5173`
   - `config.ts`: `BACKEND_URL = "http://localhost:3000"` (unused)

2. **Environment Variables**
   - Frontend uses `import.meta.env.VITE_SERVER_URL` in LoginForm but not consistently
   - Backend requires: `MONGO_URI`, `PORT`, `SESSION_SECRET`, `ACCESS_KEY`, `REFRESH_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `FRONTEND_URI`

3. **Error Handling**
   - Some `@ts-ignore` comments in authRoutes.ts (lines 118, 470)
   - Inconsistent error response formats
   - Google callback uses `UI_URL` instead of `FRONTEND_URI` (line 227)

4. **Code Quality**
   - `useContent` hook polls every 10 seconds (could use WebSockets or better polling strategy)
   - No rate limiting on API endpoints
   - Email sending code commented out (line 84 in authRoutes.ts)
   - Some unused imports/types

5. **Database**
   - No indexes defined on frequently queried fields (email, googleId, userId in Content)
   - Tag creation could be optimized (currently creates one at a time)

6. **Type Safety**
   - Some `any` types used (e.g., `req.user as any`)
   - Missing type definitions for some Mongoose documents

### **Good Practices**

✅ Separation of concerns (routes, middlewares, utils)
✅ Centralized error handling
✅ Async error wrapper (`asyncWrap`)
✅ TypeScript throughout
✅ Form validation on both client and server
✅ Responsive design
✅ Modern React patterns (hooks, functional components)

---

## 🚀 Deployment Considerations

### **Backend**
- Set `NODE_ENV=production`
- Configure all environment variables
- Use MongoDB Atlas or production MongoDB instance
- Enable HTTPS for secure cookies
- Consider adding rate limiting
- Set up proper logging

### **Frontend**
- Build with `npm run build`
- Configure environment variables for production API URL
- Serve static files via CDN or web server
- Update CORS settings on backend

---

## 📊 Dependencies Summary

### **Backend Key Dependencies**
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `passport` + `passport-jwt` + `passport-google-oauth20`: Authentication
- `jsonwebtoken`: JWT handling
- `bcrypt`: Password hashing
- `zod`: Validation
- `cookie-parser`: Cookie handling
- `express-session`: Session management

### **Frontend Key Dependencies**
- `react` + `react-dom`: UI framework
- `react-router-dom`: Routing
- `@tanstack/react-query`: Server state management
- `zustand`: Client state management
- `axios`: HTTP client
- `react-hook-form` + `@hookform/resolvers`: Form handling
- `zod`: Validation
- `tailwindcss`: Styling
- `@radix-ui/*`: UI primitives
- `sonner`: Toast notifications

---

## 🎯 Project Purpose

This appears to be a **content curation and sharing platform** where users can:
1. Save links to content from various social platforms
2. Organize content with tags
3. Filter and search their saved content
4. Share their entire collection via a shareable link

The "brain" concept suggests it's a personal knowledge base or content library.

---

## 📝 Recommendations

1. **Environment Configuration**: Use environment variables consistently
2. **Type Safety**: Remove `any` types and add proper TypeScript definitions
3. **Error Handling**: Standardize error response format
4. **Performance**: Add database indexes, optimize tag creation
5. **Testing**: Add unit and integration tests
6. **Documentation**: Add API documentation (Swagger/OpenAPI)
7. **Rate Limiting**: Add rate limiting to prevent abuse
8. **Logging**: Implement structured logging
9. **Monitoring**: Add error tracking (Sentry, etc.)
10. **CI/CD**: Set up automated deployment pipeline

---

## ✅ Conclusion

This is a well-structured full-stack application with modern technologies and good separation of concerns. The authentication system is robust with JWT and OAuth support. The frontend is responsive and user-friendly. With some improvements in environment configuration, type safety, and error handling, this could be production-ready.

**Overall Assessment**: ⭐⭐⭐⭐ (4/5) - Solid foundation with room for improvements in configuration management and type safety.

