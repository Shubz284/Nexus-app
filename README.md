# Nexus
Nexus is a full-stack web application designed to be your personal "second brain" for organizing and sharing digital content. It allows you to save links from various platforms, automatically categorizing and tagging them for easy retrieval. The project includes a web dashboard, a secure backend, and a convenient Chrome extension for quick saving.

## Core Features

-   **Multi-Platform Content Aggregation**: Save content from popular sites like YouTube, Twitter, Instagram, and Facebook. The app automatically detects the content type.
-   **User Authentication**: Secure user registration and login using either local email/password or Google OAuth 2.0, managed with Passport.js and JWTs.
-   **Interactive Dashboard**: A clean, responsive dashboard built with React and Tailwind CSS to view, filter, and search your saved content.
-   **Chrome Extension**: A "Quick Save" browser extension to capture links, titles, and tags from the current page without leaving your tab.
-   **Smart Organization**: Add custom tags to your content for powerful filtering and organization.
-   **Search Functionality**: Instantly find saved items by searching through titles and tags.
-   **Shareable Collections**: Generate a unique, public link to share your entire "brain" with others.

## Tech Stack

| Component         | Technologies                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend**      | [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Zustand](https://zustand-demo.pmnd.rs/), [React Router](https://reactrouter.com/), [Axios](https://axios-http.com/) |
| **Backend**       | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/), [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/), [Passport.js](http://www.passportjs.org/), [JWT](https://jwt.io/), [Zod](https://zod.dev/) |
| **Browser Extension** | HTML, CSS, JavaScript (Web APIs)                                                                                                                                         |

## Project Structure

The repository is organized into three main sub-projects:

-   `nexus-frontend/`: The React-based user interface and dashboard.
-   `Nexus-backend/`: The Express.js server handling API requests, database interactions, and user authentication.
-   `nexus-extension/`: The Chrome browser extension for quick content saving.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

-   Node.js (v18 or later)
-   npm (Node Package Manager)
-   A running MongoDB instance (local or a cloud service like MongoDB Atlas)

### 1. Backend Setup (`Nexus-backend`)

1.  Navigate to the backend directory:
    ```sh
    cd Nexus-backend
    ```

2.  Install the dependencies:
    ```sh
    npm install
    ```

3.  Create a `.env` file by copying the example:
    ```sh
    cp .env.example .env
    ```

4.  Edit the `.env` file and provide the required values. At a minimum, you must configure:
    -   `MONGO_URI`: Your MongoDB connection string.
    -   `PORT`: The port for the backend server (e.g., 3000).
    -   `SESSION_SECRET`, `ACCESS_KEY`, `REFRESH_KEY`: Long, random strings for security.
    -   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Your Google OAuth 2.0 credentials.
    -   `FRONTEND_URI`: The URL of your running frontend (e.g., `http://localhost:5173`).
    -   `GOOGLE_REDIRECT_URI`: The backend callback URL (e.g., `http://localhost:3000/auth/google/callback`).

5.  Start the development server:
    ```sh
    npm run dev
    ```
    The backend will be running on the port specified in your `.env` file.

### 2. Frontend Setup (`nexus-frontend`)

1.  Navigate to the frontend directory:
    ```sh
    cd ../nexus-frontend
    ```

2.  Install the dependencies:
    ```sh
    npm install
    ```

3.  Create a `.env` file by copying the example:
    ```sh
    cp .env.example .env
    ```

4.  Edit the `.env` file and set the backend URL:
    -   `VITE_SERVER_URL`: The full URL of your running backend (e.g., `http://localhost:3000`).

5.  Start the development server:
    ```sh
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173` (or another port if 5173 is in use).

### 3. Chrome Extension Setup (`nexus-extension`)

1.  Open Google Chrome and navigate to `chrome://extensions`.
2.  Enable **Developer mode** using the toggle in the top-right corner.
3.  Click the **Load unpacked** button.
4.  Select the `nexus-extension` folder from the repository.
5.  Pin the "Nexus Quick Save" extension to your toolbar for easy access.

**Note**: For the extension to work, you must be logged into the Nexus web application in your browser, as it uses the same session cookies for authentication.

## Usage

1.  **Register/Login**: Open the web application and create an account or sign in using email/password or Google.
2.  **Add Content**:
    -   **Via Web App**: On the dashboard, click the "Add" button to open a modal where you can paste a link, add a title, and assign tags.
    -   **Via Extension**: While browsing a page you want to save, click the Nexus extension icon. The title and link will be auto-filled. Add optional tags and click "Save".
3.  **View and Filter**: Your saved content appears on the dashboard. Use the sidebar to filter by content type (All, Twitter, YouTube, etc.) or use the search bar to find content by title or tag.
4.  **Share Your Brain**: Click the "Share" button on the dashboard to generate a unique public URL for your entire collection. Anyone with the link can view your curated content.
