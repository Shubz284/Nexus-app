import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (noteData: {
    title: string;
    content: string;
    color?: string;
    tags?: string[];
  }) => void;
  initialNote?: any;
  isEditing?: boolean;
}

const colorOptions = [
  { value: "bg-yellow-100", label: "Yellow", bgColor: "bg-yellow-100" },
  { value: "bg-pink-100", label: "Pink", bgColor: "bg-pink-100" },
  { value: "bg-blue-100", label: "Blue", bgColor: "bg-blue-100" },
  { value: "bg-green-100", label: "Green", bgColor: "bg-green-100" },
  { value: "bg-purple-100", label: "Purple", bgColor: "bg-purple-100" },
  { value: "bg-orange-100", label: "Orange", bgColor: "bg-orange-100" },
];

const NoteModal: React.FC<NoteModalProps> = ({
  open,
  onClose,
  onSave,
  initialNote,
  isEditing = false,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-yellow-100");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!open) return;

    if (initialNote) {
      setTitle(initialNote.title || "");
      setContent(initialNote.content || "");
      setSelectedColor(initialNote.color || "bg-yellow-100");
      setTags(initialNote.tags?.map((t: any) => t.title || t) || []);
      setTagInput("");
      return;
    }

    setTitle("");
    setContent("");
    setSelectedColor("bg-yellow-100");
    setTags([]);
    setTagInput("");
  }, [initialNote, open]);

  const handleAddTag = () => {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags((prev) => [...prev, value]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

    onSave({
      title: title.trim(),
      content: content.trim(),
      color: selectedColor,
      tags,
    });
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Note" : "Create New Note"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={8}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Color
            </label>
            <div className="mt-2 flex gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    selectedColor === color.value
                      ? "scale-110 border-gray-800"
                      : "border-transparent"
                  } ${color.bgColor}`}
                  title={color.label}
                />
              ))}
            </div>
          </div>

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

            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(index)}
                      className="hover:text-red-600"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            {isEditing ? "Update Note" : "Create Note"}
          </button>
        </div>
      </div>
    </>
  );
};

export default NoteModal;
