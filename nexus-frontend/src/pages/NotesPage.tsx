import { useState, useEffect } from "react";
import Button from "../components_Custom/Button";
import { Plus, Menu, Pin, Trash2, Edit2, Search } from "lucide-react";
import { useNotes } from "../hooks/useNotes";
import AppSidebar from "../components_Custom/AppSidebar";
import UserProfile from "../components_Custom/UserProfile";
import NoteCard from "../components_Custom/NoteCard";
import NoteModal from "../components_Custom/NoteModal";
import SearchBar from "../components_Custom/SearchBar";

const NotesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    searchNotes,
  } = useNotes();

  const handleCreateNote = async (noteData: any) => {
    await createNote(noteData);
    setModalOpen(false);
    setEditingNote(null);
  };

  const handleUpdateNote = async (noteData: any) => {
    if (editingNote) {
      await updateNote(editingNote._id, noteData);
      setModalOpen(false);
      setEditingNote(null);
    }
  };

  const handleEdit = (note: any) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchNotes(query);
  };

  const pinnedNotes = notes.filter((note) => note.isPinned);
  const unpinnedNotes = notes.filter((note) => !note.isPinned);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="w-full flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  setEditingNote(null);
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
                New Note
              </Button>
              <UserProfile />
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search notes..."
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Pinned Notes */}
              {pinnedNotes.length > 0 && (
                <div className="mb-12">
                  <h2 className="mb-4 text-xl font-semibold text-gray-700">
                    📌 Pinned Notes
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        onEdit={() => handleEdit(note)}
                        onDelete={() => deleteNote(note._id)}
                        onTogglePin={() => togglePin(note._id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Notes */}
              {unpinnedNotes.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold text-gray-700">
                    All Notes
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {unpinnedNotes.map((note) => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        onEdit={() => handleEdit(note)}
                        onDelete={() => deleteNote(note._id)}
                        onTogglePin={() => togglePin(note._id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {notes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 text-5xl">📝</div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-700">
                    No notes yet
                  </h3>
                  <p className="mb-6 text-gray-500">
                    Create your first note to get started!
                  </p>
                  <Button
                    onClick={() => {
                      setEditingNote(null);
                      setModalOpen(true);
                    }}
                    className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                  >
                    Create Note
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Note Modal */}
      <NoteModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingNote(null);
        }}
        onSave={editingNote ? handleUpdateNote : handleCreateNote}
        initialNote={editingNote}
        isEditing={!!editingNote}
      />
    </div>
  );
};

export default NotesPage;
