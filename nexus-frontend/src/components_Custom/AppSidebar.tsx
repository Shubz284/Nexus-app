import { BrainIcon } from "lucide-react";
import { X } from "lucide-react";
import { TwitterIcon } from "../icons/TwitterIcon";
import YoutubeIcon from "../icons/YoutubeIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { FacebookIcon } from "../icons/FacebookIcon";

interface SidebarItemProps {
  text: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ text, icon, isActive, onClick }: SidebarItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-purple-50 ${
        isActive ? "bg-purple-100 text-purple-700" : "text-gray-700"
      }`}
    >
      <div className="flex h-5 w-5 items-center justify-center">{icon}</div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

interface AppSidebarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const AppSidebar = ({
  activeFilter,
  onFilterChange,
  isOpen = false,
  onClose,
}: AppSidebarProps) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen w-64 border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-2 text-purple-700">
              <BrainIcon className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-purple-700">Nexus</h2>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-4">
        <SidebarItem
          text="All Content"
          icon={<BrainIcon className="h-5 w-5" />}
          isActive={activeFilter === "all"}
          onClick={() => {
            onFilterChange("all");
            onClose?.();
          }}
        />
        <SidebarItem
          text="Twitter"
          icon={<TwitterIcon />}
          isActive={activeFilter === "twitter"}
          onClick={() => {
            onFilterChange("twitter");
            onClose?.();
          }}
        />
        <SidebarItem
          text="YouTube"
          icon={<YoutubeIcon />}
          isActive={activeFilter === "youtube"}
          onClick={() => {
            onFilterChange("youtube");
            onClose?.();
          }}
        />
        <SidebarItem
          text="Instagram"
          icon={<InstagramIcon />}
          isActive={activeFilter === "instagram"}
          onClick={() => {
            onFilterChange("instagram");
            onClose?.();
          }}
        />
        <SidebarItem
          text="Facebook"
          icon={<FacebookIcon />}
          isActive={activeFilter === "facebook"}
          onClick={() => {
            onFilterChange("facebook");
            onClose?.();
          }}
        />
      </nav>
    </aside>
  );
};

export default AppSidebar;
