# Nexus Quick Save Extension (Phase 1)

This Chrome extension lets you save the current tab to Nexus with:

- Auto-filled title
- Auto-filled link
- Auto-detected content type (youtube/twitter/instagram/facebook/other)
- Optional comma-separated tags

## Load extension in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `nexus-extension` folder

## Run backend/frontend

- Backend should run at `http://localhost:3000`
- Frontend should run at `http://localhost:5173`

## Auth behavior

The extension calls `POST /auth/content` with `credentials: include`, so you must be logged in to Nexus in your browser.

If save fails with 401:

- Open Nexus and login again
- Try save again from extension popup

## Notes

- Backend CORS was updated to allow `chrome-extension://...` origins for local development.
- For production, set a fixed extension origin in backend env:
  - `EXTENSION_ORIGIN=chrome-extension://<your-extension-id>`
