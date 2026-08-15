import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext, type AppUser } from "./auth-context";
import { auth } from "./base";
import { demoMode } from "./config";

const demoUser: AppUser = {
  uid: "demo-user",
  displayName: "Demo User",
  email: "demo@example.com",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(
    demoMode ? demoUser : null,
  );
  const [loading, setLoading] = useState(!demoMode);

  useEffect(() => {
    if (demoMode) return;

    return onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  const value = useMemo(
    () => ({ currentUser, loading }),
    [currentUser, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
