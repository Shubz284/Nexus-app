import { create } from "zustand";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getUser } from "@/api/axios";

// Types
interface User {
  _id: string; // From API
  id?: string; // After formatting
  userName?: string;
  firstName?: string; // After formatting
  lastName?: string; // After formatting
  [key: string]: any;
}

interface UserStore {
  // You can add additional user-related state here if needed
  // For example, user preferences, settings, etc.
  userPreferences: Record<string, any>;
  setUserPreferences: (preferences: Record<string, any>) => void;
  clearUserData: () => void;
}

/**
 * Formats the user object received from the backend to match frontend needs.
 * @param user - The raw user object from the API.
 * @returns The formatted user object or null.
 */
const formatUser = (user: User | null): User | null => {
  if (!user) {
    return null;
  }

  const { userName } = user;
  const firstName = userName?.split(" ")[0];
  const lastName = userName?.split(" ")[1];

  const formattedUser: User = {
    ...user,
    id: user._id,
    firstName,
    lastName,
  };

  return formattedUser;
};

// Zustand store for additional user-related state (optional)
export const useUserStore = create<UserStore>()((set) => ({
  userPreferences: {},

  setUserPreferences: (preferences: Record<string, any>) =>
    set({ userPreferences: preferences }),

  clearUserData: () => set({ userPreferences: {} }),
}));

// TanStack Query hook for user data
export const useUserQuery = (): UseQueryResult<User | null, Error> => {
  return useQuery<User, Error, User | null>({
    queryKey: ["user"],
    queryFn: getUser,

    select: (user: User) => {
      const formattedUser = formatUser(user);
      return formattedUser;
    },

    retry: (failureCount: number, error: Error) => {
      // Don't retry auth errors - interceptor handles these
      if ((error as any)?.response?.status === 401) return false;

      // Don't retry client errors (4xx except 401)
      if (
        (error as any)?.response?.status >= 400 &&
        (error as any)?.response?.status < 500
      ) {
        return false;
      }

      // Retry network errors and server errors (5xx) up to 3 times
      if (
        (error as any)?.errorType === "NETWORK_ERROR" ||
        (error as any)?.response?.status >= 500
      ) {
        return failureCount < 3;
      }

      return false;
    },

    // Exponential backoff for retries
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),

    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime in v5)
  });
};

// Convenience hooks
export const useUser = () => {
  const { data } = useUserQuery();
  return data;
};

export const useUserLoading = () => {
  const { isLoading } = useUserQuery();
  return isLoading;
};

export const useUserError = () => {
  const { error } = useUserQuery();
  return error;
};

// Hook that combines query data with store actions
export const useUserWithActions = () => {
  const queryResult = useUserQuery();
  const storeActions = useUserStore();

  return {
    ...queryResult,
    ...storeActions,
  };
};

// Types for export
export type { User, UserStore };
