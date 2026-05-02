import { Pin, Trash2, Edit2, PinOff, FileText, Download } from "lucide-react";
import React from "react";

interface DocumentCardProps {
  document: {
    _id: string;
    title: string;
    description: string;
    originalName: string;
    filename: string;
    size: number;
    isPinned: boolean;
    createdAt: string;
    tags?: Array<{ title: string }>;
  };
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onEdit,
  onDelete,
  onTogglePin,
}) => {
  const formattedDate = new Date(document.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = () => {
    const ext = document.originalName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
      return <FileText className="h-8 w-8 text-red-600" />;
    }
    return <FileText className="h-8 w-8 text-blue-600" />;
  };

  return (
    <div className="group relative flex flex-col gap-3 rounded-lg border-2 border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* File Icon and Info */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">{getFileIcon()}</div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 line-clamp-2 text-lg font-semibold text-gray-800">
            {document.title}
          </h3>
          <p className="mb-2 line-clamp-2 text-sm text-gray-600">
            {document.description || document.originalName}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{document.originalName}</span>
            <span>•</span>
            <span>{formatFileSize(document.size)}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {document.tags && document.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {document.tags.slice(0, 2).map((tag: any) => (
            <span
              key={tag._id || tag.title}
              className="inline-block rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700"
            >
              {tag.title}
            </span>
          ))}
          {document.tags.length > 2 && (
            <span className="inline-block rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700">
              +{document.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-300 pt-3">
        <span className="text-xs text-gray-600">{formattedDate}</span>

        {/* Action Buttons */}
        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <a
            href={`/uploads/${document.filename}`}
            download
            className="rounded p-1 hover:bg-green-200"
            title="Download document"
          >
            <Download className="h-4 w-4 text-green-600" />
          </a>
          <button
            onClick={onEdit}
            className="rounded p-1 hover:bg-gray-200"
            title="Edit document"
          >
            <Edit2 className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={onTogglePin}
            className="rounded p-1 hover:bg-gray-200"
            title={document.isPinned ? "Unpin document" : "Pin document"}
          >
            {document.isPinned ? (
              <PinOff className="h-4 w-4 text-gray-600" />
            ) : (
              <Pin className="h-4 w-4 text-gray-600" />
            )}
          </button>
          <button
            onClick={onDelete}
            className="rounded p-1 hover:bg-red-200"
            title="Delete document"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
