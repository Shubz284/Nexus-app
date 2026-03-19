import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axiosInstance from "@/api/axios";
import Card from "../components_Custom/Cards";
import { toast } from "sonner";
import { Brain, ArrowLeft, Sparkles, Share2 } from "lucide-react";

interface Content {
  _id: string;
  title: string;
  link: string;
  type: "twitter" | "youtube" | "instagram" | "facebook";
  tags?: Array<string | { title?: string }>;
}

const SharedBrain = () => {
  const { shareLink } = useParams<{ shareLink: string }>();
  const navigate = useNavigate();
  const [contents, setContents] = useState<Content[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axiosInstance.get(`/auth/brain/${shareLink}`);

        setContents(response.data.content || []);
        setUserName(response.data.userName || "Unknown User");
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching shared content:", error);
        setError(true);
        setLoading(false);

        if (error.response?.status === 411) {
          toast.error("Invalid share link");
        } else {
          toast.error("Failed to load shared content");
        }
      }
    };

    if (shareLink) {
      fetchSharedContent();
    }
  }, [shareLink]);

  const handleDeleteContent = () => {
    // This is a shared view - no delete functionality
    toast.error("Cannot delete content in shared view");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          <p className="text-gray-600">Loading shared content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
          <div className="mb-4 inline-block rounded-full bg-red-100 p-4">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Oops! Link Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            This share link is invalid or has been removed.
          </p>
          <button
            onClick={() => navigate("/auth/signup")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white transition-all hover:scale-105 hover:shadow-lg"
          >
            <Sparkles size={20} />
            Create Your Own Brain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Header with Prominent Username */}
      <div className="border-b border-purple-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Brain Icon */}
            <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-4 shadow-lg">
              <Brain className="h-10 w-10 text-white" />
            </div>

            {/* Username - Make it SUPER prominent */}
            <h1 className="mb-3 text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {userName}
              </span>
              's Brain
            </h1>

            {/* Subtitle with content count */}
            <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
              {contents.length > 0 ? (
                <>
                  Discover{" "}
                  <span className="font-semibold text-purple-600">
                    {contents.length}
                  </span>{" "}
                  curated piece{contents.length !== 1 ? "s" : ""} of knowledge
                </>
              ) : (
                "A curated collection of knowledge and inspiration"
              )}
            </p>

            {/* CTA Button */}
            <button
              onClick={() => navigate("/auth/signup")}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <Sparkles className="h-5 w-5" />
              Create Your Own Brain
              <ArrowLeft className="h-5 w-5 rotate-180 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {contents.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Shared Collection
              </h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Share2 size={16} />
                Share This Brain
              </button>
            </div>
            <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {contents.map((content) => {
                const { _id, type, link, title, tags } = content;
                return (
                  <Card
                    key={_id}
                    contentId={_id}
                    title={title}
                    type={type}
                    link={link}
                    tags={tags}
                    onDelete={handleDeleteContent}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <div className="mb-4 inline-block rounded-full bg-gradient-to-br from-purple-100 to-pink-100 p-6">
              <Brain className="h-16 w-16 text-purple-500" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              No Content Yet
            </h3>
            <p className="mb-6 text-gray-500">
              This brain is waiting to be filled with amazing content!
            </p>
            <button
              onClick={() => navigate("/auth/signup")}
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white transition-colors hover:bg-purple-700"
            >
              Start Your Own Brain
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedBrain;
