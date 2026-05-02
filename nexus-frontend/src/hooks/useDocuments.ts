import { useEffect, useState } from "react";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";

interface Document {
  _id: string;
  title: string;
  originalName: string;
  filename: string;
  description: string;
  userId: string;
  tags: any[];
  size: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/documents");
      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (
    file: File,
    title: string,
    description?: string,
    tags?: string[],
  ) => {
    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("title", title);
      formData.append("description", description || "");
      if (tags && tags.length > 0) {
        formData.append("tags", JSON.stringify(tags));
      }

      const response = await axiosInstance.post("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Document uploaded successfully");
        fetchDocuments();
        return response.data.document;
      }
    } catch (error: any) {
      console.error("Error uploading document:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to upload document";
      toast.error(errorMsg);
    }
  };

  const updateDocument = async (
    documentId: string,
    documentData: Partial<{
      title: string;
      description: string;
      tags: string[];
      isPinned: boolean;
    }>,
  ) => {
    try {
      const response = await axiosInstance.put(
        `/documents/${documentId}`,
        documentData,
      );
      if (response.data.success) {
        toast.success("Document updated successfully");
        fetchDocuments();
        return response.data.document;
      }
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document");
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const response = await axiosInstance.delete(`/documents/${documentId}`);
      if (response.data.success) {
        toast.success("Document deleted successfully");
        fetchDocuments();
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  const togglePin = async (documentId: string) => {
    try {
      const response = await axiosInstance.patch(
        `/documents/${documentId}/toggle-pin`,
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchDocuments();
        return response.data.document;
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
      toast.error("Failed to toggle pin");
    }
  };

  const searchDocuments = async (query: string) => {
    try {
      if (!query.trim()) {
        fetchDocuments();
        return;
      }
      const response = await axiosInstance.get("/documents/search/query", {
        params: { q: query },
      });
      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      console.error("Error searching documents:", error);
      toast.error("Failed to search documents");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    fetchDocuments,
    uploadDocument,
    updateDocument,
    deleteDocument,
    togglePin,
    searchDocuments,
  };
};
