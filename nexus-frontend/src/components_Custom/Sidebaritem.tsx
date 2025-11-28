import type { ReactElement } from "react";

const SidebarItem = ({ text, icon }: { text: string; icon: ReactElement }) => {
  return (
    <div className="m-2 mb-2 flex cursor-pointer items-center gap-2 rounded-lg p-2 font-medium transition-all duration-700 hover:bg-slate-200 hover:text-black">
      {icon} {text}
    </div>
  );
};

export default SidebarItem;
