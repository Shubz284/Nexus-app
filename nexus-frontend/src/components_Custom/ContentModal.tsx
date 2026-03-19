import { useState } from "react";
import axiosInstance from "@/api/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { YoutubeIcon, TwitterIcon } from "lucide-react";
import { InstagramIcon } from "@/icons/InstagramIcon";
import { FacebookIcon } from "@/icons/FacebookIcon";
import { toast } from "sonner";

type ContentType = "youtube" | "twitter" | "instagram" | "facebook";

interface ContentModalProps {
  open: boolean;
  onClose: () => void;
}

const ContentModal = ({ open, onClose }: ContentModalProps) => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState<ContentType>("youtube");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !link.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        link,
        title,
        type,
        tags,
      };
      console.log("Submitting content with payload:", payload);

      await axiosInstance.post(`/auth/content`, payload);

      toast.success("Content added successfully!");
      setTitle("");
      setLink("");
      setTags([]);
      setTagInput("");
      setType("youtube");
      onClose();
    } catch (error) {
      console.error("Error adding content:", error);
      toast.error("Failed to add content");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Content</DialogTitle>
          <DialogDescription>
            Add content from YouTube, Twitter, Instagram, or Facebook to your
            collection
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter content title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              type="url"
              placeholder="https://..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-2 rounded-full bg-[#eef2ff] px-3 py-1 text-sm text-indigo-700"
                >
                  <span className="max-w-[8rem] truncate">#{t}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setTags((prev) => prev.filter((x) => x !== t))
                    }
                    className="ml-1 rounded-full bg-indigo-100 p-0.5 text-xs text-indigo-700 hover:bg-indigo-200"
                    aria-label={`Remove ${t}`}
                  >
                    ×
                  </button>
                </span>
              ))}

              <Input
                id="tags"
                placeholder="Type tag and press Enter, comma, or space"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "," || e.key === " ") {
                    e.preventDefault();
                    let raw = tagInput.trim();
                    // Remove # if user typed it
                    if (raw.startsWith("#")) {
                      raw = raw.substring(1).trim();
                    }
                    if (raw && !tags.includes(raw)) {
                      setTags((prev) => [...prev, raw]);
                    }
                    setTagInput("");
                  }
                }}
                onBlur={() => {
                  // Also add tag on blur if there's text
                  let raw = tagInput.trim();
                  if (raw.startsWith("#")) {
                    raw = raw.substring(1).trim();
                  }
                  if (raw && !tags.includes(raw)) {
                    setTags((prev) => [...prev, raw]);
                    setTagInput("");
                  }
                }}
                disabled={isSubmitting}
                className="min-w-[120px] flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              Press Enter, comma, or space to add tags
            </p>
          </div>

          <div className="space-y-2">
            <Label>Content Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("youtube")}
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition-all ${
                  type === "youtube"
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <YoutubeIcon className="h-5 w-5" />
                <span className="font-medium">YouTube</span>
              </button>

              <button
                type="button"
                onClick={() => setType("twitter")}
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition-all ${
                  type === "twitter"
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <TwitterIcon className="h-5 w-5" />
                <span className="font-medium">Twitter</span>
              </button>

              <button
                type="button"
                onClick={() => setType("instagram")}
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition-all ${
                  type === "instagram"
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <InstagramIcon />
                <span className="font-medium">Instagram</span>
              </button>

              <button
                type="button"
                onClick={() => setType("facebook")}
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition-all ${
                  type === "facebook"
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <FacebookIcon />
                <span className="font-medium">Facebook</span>
              </button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Adding..." : "Add Content"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContentModal;
