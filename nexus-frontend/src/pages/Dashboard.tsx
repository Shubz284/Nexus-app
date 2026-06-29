import Button from "../components_Custom/Button";
import { Share2 } from "lucide-react";
import { Plus } from "lucide-react";
import { Menu } from "lucide-react";
import Card from "../components_Custom/Cards";
import ContentModal from "../components_Custom/ContentModal";
import { useEffect, useState, useMemo } from "react";
import AppSidebar from "../components_Custom/AppSidebar";
import useContent from "../hooks/useContent";
import axiosInstance from "@/api/axios";
import { APP_URL } from "@/config/env";
import SearchBar from "../components_Custom/SearchBar";
import { toast } from "sonner";
import UserProfile from "../components_Custom/UserProfile";

type AiExplainResult = {
  summary: string;
  keyPoints: string[];
  relatedTopics: string[];
  disclaimer: string;
};

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { contents, refresh } = useContent();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiResult, setAiResult] = useState<AiExplainResult | null>(null);
  const [aiCache, setAiCache] = useState<Record<string, AiExplainResult>>({});

  // Filter contents based on search query and type filter
  const filteredContents = useMemo(() => {
    let filtered = contents;

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((content: any) => content.type === typeFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((content: any) => {
        // Search in title
        const matchesTitle = content.title?.toLowerCase().includes(query);

        // Search in tags
        const matchesTags = content.tags?.some((tag: any) => {
          const tagTitle = typeof tag === "string" ? tag : tag?.title;
          return tagTitle?.toLowerCase().includes(query);
        });

        return matchesTitle || matchesTags;
      });
    }

    return filtered;
  }, [contents, searchQuery, typeFilter]);

  useEffect(() => {
    refresh();
  }, [modalOpen]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setAiLoading(false);
      setAiError("");
      setAiResult(null);
      return;
    }

    const cacheKey = query.toLowerCase();
    if (aiCache[cacheKey]) {
      setAiError("");
      setAiResult(aiCache[cacheKey]);
      return;
    }

    const timer = setTimeout(async () => {
      setAiLoading(true);
      setAiError("");

      try {
        const response = await axiosInstance.post("/ai/explain", {
          query,
        });
        const result = response?.data?.result as AiExplainResult | undefined;

        if (!result) {
          throw new Error("No AI result returned");
        }

        setAiResult(result);
        setAiCache((prev) => ({
          ...prev,
          [cacheKey]: result,
        }));
      } catch (error) {
        console.error("AI explain error:", error);
        const backendMessage =
          (error as any)?.response?.data?.message ||
          "AI insight is currently unavailable. Showing normal results.";
        setAiError(backendMessage);
      } finally {
        setAiLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery, aiCache]);

  const handleShareBrain = async function () {
    const response = await axiosInstance.post(`/auth/brain/share`, {
      share: true,
    });
    const shareUrl = `${APP_URL}/share/${response.data.hash}`;
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link is copied to clipbard");
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      await axiosInstance.delete(`/auth/content`, {
        data: { contentId },
      });
      toast.success("Content deleted successfully!");
      refresh(); // Refresh the content list
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AppSidebar
        activeFilter={typeFilter}
        onFilterChange={setTypeFilter}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="w-full flex-1 lg:ml-64">
        <ContentModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
        />

        {/* Mobile Header with Menu Button */}
        <div className="sticky top-0 z-30 border-b border-gray-200 bg-white p-4 lg:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-purple-700">Nexus</h1>
            <UserProfile />
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="mb-4 flex flex-col gap-4 lg:mb-6 lg:flex-row lg:items-center lg:justify-between">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by title or tags..."
            />
            <div className="flex items-center gap-2 lg:gap-3">
              <Button
                onClick={handleShareBrain}
                variant="primary"
                size="md"
                text={"Share"}
                startIcon={<Share2 size={17} />}
              />
              <Button
                onClick={() => {
                  setModalOpen(true);
                }}
                variant="secondary"
                size="md"
                text={"Add"}
                startIcon={<Plus size={18} />}
              />
              <div className="hidden lg:block">
                <UserProfile />
              </div>
            </div>
          </div>

          {searchQuery.trim().length >= 2 && (
            <div className="mb-4 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 lg:mb-6">
              <div className="mb-2 text-sm font-semibold text-indigo-700">
                AI Summary for: {searchQuery.trim()}
              </div>

              {aiLoading && (
                <div className="text-sm text-gray-600">Thinking...</div>
              )}

              {!aiLoading && aiError && (
                <div className="text-sm text-red-600">{aiError}</div>
              )}

              {!aiLoading && !aiError && aiResult && (
                <div className="space-y-3">
                  <p className="text-sm leading-6 text-gray-800">
                    {aiResult.summary}
                  </p>

                  {aiResult.keyPoints?.length > 0 && (
                    <div>
                      <div className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Key points
                      </div>
                      <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
                        {aiResult.keyPoints.map((point, index) => (
                          <li key={`${point}-${index}`}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiResult.relatedTopics?.length > 0 && (
                    <div>
                      <div className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Related topics
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {aiResult.relatedTopics.map((topic, index) => (
                          <button
                            key={`${topic}-${index}`}
                            onClick={() => setSearchQuery(topic)}
                            className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs text-indigo-700 hover:bg-indigo-100"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">{aiResult.disclaimer}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-6 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {filteredContents.length > 0 ? (
              filteredContents.map((content: any, index: number) => {
                const { _id, type, link, title, tags } = content;
                // Debug log to inspect incoming tags shape
                console.debug("content tags for", _id, tags);
                return (
                  <Card
                    key={_id || index}
                    contentId={_id}
                    title={title}
                    type={type}
                    link={link}
                    tags={tags}
                    onDelete={handleDeleteContent}
                  />
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                {searchQuery
                  ? "No content found matching your search."
                  : "No content yet. Add some!"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
