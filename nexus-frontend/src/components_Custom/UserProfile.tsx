import { useUser } from "@/store/userStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { LogOut, User, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const UserProfile = () => {
  const user = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");

      // Clear React Query cache
      queryClient.clear();

      toast.success("Logged out successfully");
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (!user) {
    return null;
  }

  // Get initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="group flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white transition-all hover:scale-110 hover:bg-purple-700 hover:shadow-lg focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
          title={user.userName || "User Profile"}
        >
          {getInitials(user.userName)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="cursor-default">
          <User className="mr-2 h-4 w-4" />
          <span>{user.userName}</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="cursor-default">
          <Mail className="mr-2 h-4 w-4" />
          <span className="truncate">{user.email}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
