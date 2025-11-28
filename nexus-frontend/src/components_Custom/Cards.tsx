import { Youtube } from "lucide-react";
import { Share2 } from "lucide-react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { TwitterIcon } from "@/icons/TwitterIcon";
import { InstagramIcon } from "@/icons/InstagramIcon";
import { FacebookIcon } from "@/icons/FacebookIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// dos ajax cleaning the working of the links and structure

interface CardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube" | "instagram" | "facebook";
  tags?: Array<string | { title?: string }>;
  contentId: string;
  onDelete: (contentId: string) => void;
}

const Card = (props: CardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleShare = async () => {
    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: props.title,
          text: `Check out this ${props.type} content: ${props.title}`,
          url: props.link,
        });
        // toast.success("Content shared successfully!");
      } catch (error: any) {
        // User cancelled the share
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
          toast.error("Failed to share content");
        }
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(props.link);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        toast.error("Failed to copy link");
      }
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    props.onDelete(props.contentId);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "<strong>{props.title}</strong>".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-full">
        <div className="shadow-aceternity flex h-[280px] flex-col rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg sm:h-[320px] sm:p-5">
          <div className="flex items-start justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {props.type === "youtube" && (
                <Youtube size={18} className="flex-shrink-0 text-red-600" />
              )}
              {props.type === "twitter" && (
                <div className="flex-shrink-0">
                  <TwitterIcon />
                </div>
              )}
              {props.type === "instagram" && (
                <div className="flex-shrink-0">
                  <InstagramIcon />
                </div>
              )}
              {props.type === "facebook" && (
                <div className="flex-shrink-0">
                  <FacebookIcon />
                </div>
              )}
              <div className="line-clamp-2 text-sm font-medium sm:text-base">
                {props.title}
              </div>
            </div>
            <div className="ml-2 flex flex-shrink-0 items-center gap-2">
              <button
                onClick={handleShare}
                className="rounded p-1.5 transition-colors hover:bg-gray-100"
                aria-label="Share"
              >
                <Share2
                  size={18}
                  className="text-neutral-600 hover:text-neutral-900"
                />
              </button>
              <button
                onClick={handleDeleteClick}
                className="rounded p-1.5 transition-colors hover:bg-red-50"
                aria-label="Delete"
              >
                <Trash2
                  size={18}
                  className="text-neutral-600 hover:text-red-600"
                />
              </button>
            </div>
          </div>
          <div className="mt-3 flex-1 overflow-hidden sm:mt-5">
            {props.type == "youtube" && (
              <iframe
                className="h-full w-full rounded-sm"
                src={props.link
                  .replace("watch?v=", "embed/")
                  .replace("watch", "embed")}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )}
            {props.type == "twitter" && (
              <div className="h-full overflow-auto">
                <blockquote className="twitter-tweet">
                  <a href={props.link.replace("x.com", "twitter.com")}></a>
                </blockquote>
              </div>
            )}
            {props.type == "instagram" && (
              <div className="h-full overflow-hidden rounded-sm border border-gray-200 bg-gray-50">
                <a
                  href={props.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <img
                    src={`https://v1.screenshot.11ty.dev/${encodeURIComponent(props.link)}/opengraph/`}
                    alt="Instagram post preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback if screenshot service fails
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EInstagram Post%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </a>
              </div>
            )}
            {props.type == "facebook" && (
              <div className="h-full overflow-hidden rounded-sm border border-gray-200 bg-gray-50">
                <iframe
                  src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(props.link)}&show_text=false&width=500`}
                  className="h-full w-full"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                ></iframe>
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-indigo-600 sm:mt-4">
            {(() => {
              const t = props.tags as any;
              if (!t) return null;
              if (typeof t === "string") {
                return t
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean)
                  .map((title: string, i: number) => (
                    <div
                      key={i}
                      className="rounded-full bg-[#e0e7ff] px-3 py-1 text-xs sm:text-sm"
                    >
                      #{title}
                    </div>
                  ));
              }

              if (Array.isArray(t) && t.length > 0) {
                return t.map((item: any, i: number) => {
                  let title = "";
                  if (typeof item === "string") title = item;
                  else if (item && typeof item === "object") {
                    title = item.title || item.name || "";
                  }
                  title = (title || "").toString();
                  if (!title) return null;
                  return (
                    <div
                      key={i}
                      className="rounded-full bg-[#e0e7ff] px-3 py-1 text-xs sm:text-sm"
                    >
                      #{title}
                    </div>
                  );
                });
              }

              return null;
            })()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
