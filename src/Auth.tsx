import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { AuthContext, type AppUser } from "./auth-context";
import { auth } from "./base";
import { demoMode } from "./config";
import { GroupProvider } from "./Features/Groups/GroupProvider";

const demoUser: AppUser = {
  uid: "demo-user",
  displayName: "Demo User",
  email: "demo@example.com",
  emailVerified: true,
};

function toAppUser(user: User): AppUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    emailVerified: user.emailVerified,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(
    demoMode ? demoUser : null,
  );
  const [loading, setLoading] = useState(!demoMode);

  useEffect(() => {
    if (demoMode) return;

    return onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? toAppUser(user) : null);
      setLoading(false);
    });
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    if (demoMode) return;

    const user = auth.currentUser;
    if (!user) {
      setCurrentUser(null);
      return;
    }

    await user.reload();
    setCurrentUser(toAppUser(user));
  }, []);

  const value = useMemo(
    () => ({ currentUser, loading, refreshCurrentUser }),
    [currentUser, loading, refreshCurrentUser],
  );

  return (
    <AuthContext.Provider value={value}>
      <GroupProvider>{children}</GroupProvider>
    </AuthContext.Provider>
  );
}
