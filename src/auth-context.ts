import { createContext, useContext } from "react";

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
}

export interface AuthContextValue {
  currentUser: AppUser | null;
  loading: boolean;
  refreshCurrentUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
