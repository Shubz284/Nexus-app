# Notes Feature Documentation

## Overview

The Notes feature allows users to create, read, update, and delete notes with support for tags, color customization, and pinning functionality.

## Backend Implementation

### Database Schema (MongoDB)

#### Note Model

```typescript
{
  title: String (required),
  content: String,
  userId: ObjectId (ref: User, required),
  tags: [ObjectId] (ref: Tag),
  color: String (default: "bg-yellow-100"),
  isPinned: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Color Options:**

- bg-yellow-100
- bg-pink-100
- bg-blue-100
- bg-green-100
- bg-purple-100
- bg-orange-100

### API Endpoints

#### 1. Create Note

- **Method:** `POST`
- **Route:** `/notes`
- **Auth:** Required (JWT)
- **Request Body:**
  ```json
  {
    "title": "Note Title",
    "content": "Note content...",
    "tags": ["tag1", "tag2"],
    "color": "bg-yellow-100",
    "isPinned": false
  }
  ```

#### 2. Get All Notes

- **Method:** `GET`
- **Route:** `/notes`
- **Auth:** Required (JWT)
- **Response:** Returns array of notes sorted by pinned status and update date

#### 3. Get Single Note

- **Method:** `GET`
- **Route:** `/notes/:noteId`
- **Auth:** Required (JWT)

#### 4. Update Note

- **Method:** `PUT`
- **Route:** `/notes/:noteId`
- **Auth:** Required (JWT)
- **Request Body:** Any of the note fields to update

#### 5. Delete Note

- **Method:** `DELETE`
- **Route:** `/notes/:noteId`
- **Auth:** Required (JWT)

#### 6. Toggle Pin Status

- **Method:** `PATCH`
- **Route:** `/notes/:noteId/toggle-pin`
- **Auth:** Required (JWT)

#### 7. Search Notes

- **Method:** `GET`
- **Route:** `/notes/search/query?q=searchTerm`
- **Auth:** Required (JWT)
- **Description:** Searches in both title and content

## Frontend Implementation

### Components

#### NotesPage (`/src/pages/NotesPage.tsx`)

Main page component that displays all notes and handles the primary user interface.

**Features:**

- Display pinned notes separately
- Display all other notes
- Search functionality
- Create, edit, delete notes
- Pin/unpin notes
- Responsive design

#### NoteCard (`/src/components_Custom/NoteCard.tsx`)

Individual note display component showing:

- Note title
- Note preview (truncated content)
- Tags
- Creation/update date
- Action buttons (edit, pin, delete)

#### NoteModal (`/src/components_Custom/NoteModal.tsx`)

Modal for creating and editing notes with:

- Title input
- Content textarea (8 rows)
- Color selector (6 colors)
- Tag management (add/remove)
- Save/Cancel buttons

### Custom Hook

#### useNotes (`/src/hooks/useNotes.ts`)

Custom hook for managing notes state and API calls:

```typescript
const {
  notes, // Array of notes
  loading, // Loading state
  fetchNotes, // Fetch all notes
  createNote, // Create new note
  updateNote, // Update existing note
  deleteNote, // Delete a note
  togglePin, // Toggle pin status
  searchNotes, // Search notes
} = useNotes();
```

### Routes

Updated `/src/routes/AppRoutes.tsx` to include:

```typescript
{
  path: "notes",
  element: <NotesPage />
}
```

### Sidebar Navigation

Updated `AppSidebar` component to include:

- "Brain" link (Dashboard)
- "Notes" link (Notes Page)
- Conditional rendering of content filters only on Dashboard

## Usage

### Creating a Note

1. Navigate to `/app/notes`
2. Click "New Note" button
3. Fill in title, content, and optionally add tags and select color
4. Click "Create Note"

### Editing a Note

1. Click the edit (pencil) icon on any note card
2. Update the note details
3. Click "Update Note"

### Deleting a Note

1. Click the delete (trash) icon on any note card
2. Confirm deletion

### Pinning a Note

1. Click the pin icon on any note card
2. Pinned notes appear at the top

### Searching Notes

1. Use the search bar at the top of the Notes page
2. Search is performed on both title and content
3. Clear search to see all notes

### Tagging Notes

1. When creating or editing a note, add tags using the tag input
2. Enter tag name and click "Add" or press Enter
3. Remove tags by clicking the × button
4. Tags are shared across notes and searchable

## File Structure

### Backend

```
Nexus-backend/
├── src/
│   ├── db.ts (updated with NoteModel)
│   ├── index.ts (updated to import notesRouter)
│   └── routes/
│       └── notesRoutes.ts (new)
```

### Frontend

```
nexus-frontend/
├── src/
│   ├── pages/
│   │   └── NotesPage.tsx (new)
│   ├── components_Custom/
│   │   ├── NoteCard.tsx (new)
│   │   ├── NoteModal.tsx (new)
│   │   └── AppSidebar.tsx (updated)
│   ├── hooks/
│   │   └── useNotes.ts (new)
│   └── routes/
│       └── AppRoutes.tsx (updated)
```

## API Response Examples

### Create Note Response

```json
{
  "success": true,
  "message": "Note created successfully",
  "note": {
    "_id": "60d5ec49c1234567890abcde",
    "title": "My First Note",
    "content": "This is my first note",
    "userId": "60d5ec49c1234567890abcdf",
    "tags": [{ "_id": "60d5ec49c1234567890abce0", "title": "important" }],
    "color": "bg-yellow-100",
    "isPinned": false,
    "createdAt": "2024-04-29T10:30:00Z",
    "updatedAt": "2024-04-29T10:30:00Z"
  }
}
```

### Get All Notes Response

```json
{
  "success": true,
  "notes": [
    {
      "_id": "60d5ec49c1234567890abcde",
      "title": "My First Note",
      "content": "This is my first note",
      "userId": "60d5ec49c1234567890abcdf",
      "tags": [],
      "color": "bg-yellow-100",
      "isPinned": true,
      "createdAt": "2024-04-29T10:30:00Z",
      "updatedAt": "2024-04-29T10:30:00Z"
    }
  ]
}
```

## Error Handling

All endpoints include proper error handling:

- 400: Bad request (validation errors)
- 401: Unauthorized
- 404: Note not found
- 500: Server error

Validation uses Zod schemas to ensure data integrity.

## Future Enhancements

As mentioned, the following features will be added in future months:

- Document uploading
- PDF uploading
- File attachments in notes
- Rich text editor for note content
- Collaborative note editing
- Note sharing
- Note templates
- Voice-to-note functionality

## Testing

To test the notes feature:

1. Start the backend server
2. Navigate to `/app/notes`
3. Create a note with title, content, and tags
4. Verify note appears on the page
5. Edit the note and verify changes are saved
6. Delete the note and verify it's removed
7. Test search functionality
8. Test pinning functionality

---

Last Updated: April 29, 2026
