import { useEffect, useState } from "react";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";

interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string;
  tags: any[];
  color: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/notes");
      if (response.data.success) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData: {
    title: string;
    content?: string;
    tags?: string[];
    color?: string;
  }) => {
    try {
      const response = await axiosInstance.post("/notes", noteData);
      if (response.data.success) {
        toast.success("Note created successfully");
        fetchNotes();
        return response.data.note;
      }
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    }
  };

  const updateNote = async (
    noteId: string,
    noteData: Partial<{
      title: string;
      content: string;
      tags: string[];
      color: string;
      isPinned: boolean;
    }>,
  ) => {
    try {
      const response = await axiosInstance.put(`/notes/${noteId}`, noteData);
      if (response.data.success) {
        toast.success("Note updated successfully");
        fetchNotes();
        return response.data.note;
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const response = await axiosInstance.delete(`/notes/${noteId}`);
      if (response.data.success) {
        toast.success("Note deleted successfully");
        fetchNotes();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const togglePin = async (noteId: string) => {
    try {
      const response = await axiosInstance.patch(`/notes/${noteId}/toggle-pin`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchNotes();
        return response.data.note;
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
      toast.error("Failed to toggle pin");
    }
  };

  const searchNotes = async (query: string) => {
    try {
      if (!query.trim()) {
        fetchNotes();
        return;
      }
      const response = await axiosInstance.get("/notes/search/query", {
        params: { q: query },
      });
      if (response.data.success) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Error searching notes:", error);
      toast.error("Failed to search notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return {
    notes,
    loading,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    searchNotes,
  };
};
