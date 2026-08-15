import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { AuthContext } from "./auth-context";
import { auth } from "./base";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      }),
    [],
  );

  const value = useMemo(
    () => ({ currentUser, loading }),
    [currentUser, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
