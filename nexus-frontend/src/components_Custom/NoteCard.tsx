import { Pin, Trash2, Edit2, PinOff } from "lucide-react";
import React from "react";

interface NoteCardProps {
  note: {
    _id: string;
    title: string;
    content: string;
    color: string;
    isPinned: boolean;
    updatedAt: string;
    tags?: Array<{ title: string }>;
  };
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onTogglePin,
}) => {
  const colorMap: { [key: string]: string } = {
    "bg-yellow-100": "bg-yellow-100 border-yellow-200",
    "bg-pink-100": "bg-pink-100 border-pink-200",
    "bg-blue-100": "bg-blue-100 border-blue-200",
    "bg-green-100": "bg-green-100 border-green-200",
    "bg-purple-100": "bg-purple-100 border-purple-200",
    "bg-orange-100": "bg-orange-100 border-orange-200",
  };

  const formattedDate = new Date(note.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`group relative flex flex-col gap-3 rounded-lg border-2 p-4 shadow-sm transition-shadow hover:shadow-md ${
        colorMap[note.color] || colorMap["bg-yellow-100"]
      }`}
    >
      {/* Content */}
      <div className="flex-1">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-800">
          {note.title}
        </h3>
        <p className="mb-3 line-clamp-3 text-sm text-gray-700">
          {note.content || "No content added"}
        </p>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {note.tags.slice(0, 2).map((tag: any) => (
            <span
              key={tag._id || tag.title}
              className="inline-block rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700"
            >
              {tag.title}
            </span>
          ))}
          {note.tags.length > 2 && (
            <span className="inline-block rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700">
              +{note.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-300 pt-3">
        <span className="text-xs text-gray-600">{formattedDate}</span>

        {/* Action Buttons */}
        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="rounded p-1 hover:bg-gray-200"
            title="Edit note"
          >
            <Edit2 className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={onTogglePin}
            className="rounded p-1 hover:bg-gray-200"
            title={note.isPinned ? "Unpin note" : "Pin note"}
          >
            {note.isPinned ? (
              <PinOff className="h-4 w-4 text-gray-600" />
            ) : (
              <Pin className="h-4 w-4 text-gray-600" />
            )}
          </button>
          <button
            onClick={onDelete}
            className="rounded p-1 hover:bg-red-200"
            title="Delete note"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
