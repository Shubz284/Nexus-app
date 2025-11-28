import { BrainIcon } from "lucide-react";
import { TwitterIcon } from "../icons/TwitterIcon";
import YoutubeIcon from "../icons/YoutubeIcon";
import SidebarItem from "./Sidebaritem";

const Sidebarx = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-60 border-r border-neutral-200 bg-white p-2">
      <div className="m-2 flex items-center gap-2">
        <div className="p-1 text-purple-700">
          <BrainIcon />
        </div>
        <h2 className="text-2xl font-bold text-purple-700">Nexus</h2>
      </div>
      <div className="pt-4 pl-2 text-gray-600">
        <SidebarItem text="Twitter" icon={<TwitterIcon />} />
        <SidebarItem text="Youtube" icon={<YoutubeIcon />} />
      </div>
    </div>
  );
};

export default Sidebarx;
