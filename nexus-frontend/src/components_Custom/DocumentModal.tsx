import React, { useState, useEffect } from "react";
import { X, Upload, FileText } from "lucide-react";

interface DocumentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (documentData: {
    file?: File;
    title: string;
    description?: string;
    tags?: string[];
  }) => void;
  initialDocument?: any;
  isEditing?: boolean;
  uploading?: boolean;
}

const DocumentModal: React.FC<DocumentModalProps> = ({
  open,
  onClose,
  onSave,
  initialDocument,
  isEditing = false,
  uploading = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (initialDocument) {
      setTitle(initialDocument.title || "");
      setDescription(initialDocument.description || "");
      setTags(initialDocument.tags?.map((t: any) => t.title || t) || []);
      setFileName(initialDocument.originalName || "");
    } else {
      resetForm();
    }
  }, [initialDocument, open]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setTagInput("");
    setFile(null);
    setFileName("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only PDF and Word documents are allowed");
      return;
    }

    // Validate file size (50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      alert("File size must be less than 50MB");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    e.target.value = "";
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!isEditing && !file) {
      alert("Please select a document to upload");
      return;
    }

    onSave({
      file: file || undefined,
      title: title.trim(),
      description: description.trim(),
      tags,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Document" : "Upload New Document"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title..."
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this document..."
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* File Upload */}
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Document
              </label>
              <div className="mt-2">
                <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 hover:border-blue-500">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-600" />
                    <span className="mt-2 text-sm text-gray-600">
                      Click to upload or drag file
                    </span>
                    <span className="text-xs text-gray-500">
                      PDF, DOC, DOCX (Max 50MB)
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Selected File Display */}
              {fileName && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {fileName}
                    </p>
                    {file && (
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setFileName("");
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Display existing file when editing */}
          {isEditing && initialDocument && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current File
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {initialDocument.originalName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(initialDocument.size)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a tag and press Enter..."
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleAddTag}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
              >
                Add
              </button>
            </div>

            {/* Display Tags */}
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(index)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={uploading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading
              ? "Uploading..."
              : isEditing
                ? "Update Document"
                : "Upload Document"}
          </button>
        </div>
      </div>
    </>
  );
};

export default DocumentModal;
