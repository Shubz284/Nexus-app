import { useState } from "react";
import { Plus, Menu } from "lucide-react";
import { useDocuments } from "../hooks/useDocuments";
import AppSidebar from "../components_Custom/AppSidebar";
import UserProfile from "../components_Custom/UserProfile";
import DocumentCard from "../components_Custom/DocumentCard";
import DocumentModal from "../components_Custom/DocumentModal";
import SearchBar from "../components_Custom/SearchBar";
import Button from "../components_Custom/Button";

const DocumentsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const {
    documents,
    loading,
    uploadDocument,
    updateDocument,
    deleteDocument,
    togglePin,
    searchDocuments,
  } = useDocuments();

  const handleUpload = async (documentData: any) => {
    setUploading(true);
    if (editingDocument) {
      // Update existing document
      await updateDocument(editingDocument._id, {
        title: documentData.title,
        description: documentData.description,
        tags: documentData.tags,
      });
    } else {
      // Upload new document
      if (documentData.file) {
        await uploadDocument(
          documentData.file,
          documentData.title,
          documentData.description,
          documentData.tags,
        );
      }
    }
    setUploading(false);
    setModalOpen(false);
    setEditingDocument(null);
  };

  const handleEdit = (document: any) => {
    setEditingDocument(document);
    setModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchDocuments(query);
  };

  const pinnedDocuments = documents.filter((doc) => doc.isPinned);
  const unpinnedDocuments = documents.filter((doc) => !doc.isPinned);

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
              <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  setEditingDocument(null);
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
                Upload Document
              </Button>
              <UserProfile />
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search documents..."
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
              {/* Pinned Documents */}
              {pinnedDocuments.length > 0 && (
                <div className="mb-12">
                  <h2 className="mb-4 text-xl font-semibold text-gray-700">
                    📌 Pinned Documents
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pinnedDocuments.map((document) => (
                      <DocumentCard
                        key={document._id}
                        document={document}
                        onEdit={() => handleEdit(document)}
                        onDelete={() => deleteDocument(document._id)}
                        onTogglePin={() => togglePin(document._id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Documents */}
              {unpinnedDocuments.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold text-gray-700">
                    All Documents
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {unpinnedDocuments.map((document) => (
                      <DocumentCard
                        key={document._id}
                        document={document}
                        onEdit={() => handleEdit(document)}
                        onDelete={() => deleteDocument(document._id)}
                        onTogglePin={() => togglePin(document._id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {documents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 text-5xl">📄</div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-700">
                    No documents yet
                  </h3>
                  <p className="mb-6 text-gray-500">
                    Start uploading documents to organize them!
                  </p>
                  <Button
                    onClick={() => {
                      setEditingDocument(null);
                      setModalOpen(true);
                    }}
                    className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                  >
                    Upload Document
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Document Modal */}
      <DocumentModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingDocument(null);
        }}
        onSave={handleUpload}
        initialDocument={editingDocument}
        isEditing={!!editingDocument}
        uploading={uploading}
      />
    </div>
  );
};

export default DocumentsPage;
