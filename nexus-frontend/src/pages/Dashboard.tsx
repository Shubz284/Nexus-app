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
import SearchBar from "../components_Custom/SearchBar";
import { toast } from "sonner";
import UserProfile from "../components_Custom/UserProfile";

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { contents, refresh } = useContent();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

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

  const handleShareBrain = async function () {
    const response = await axiosInstance.post(`/auth/brain/share`, {
      share: true,
    });
    const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
    await navigator.clipboard.writeText(shareUrl);
    alert(`Link copied to clipboard:${shareUrl}`);
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
