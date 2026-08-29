import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "../../auth-context";
import type { Group } from "./groupDomain";
import { GroupContext } from "./groupContext";
import {
  activeGroupStorageKey,
  parseActiveGroup,
  serializeActiveGroup,
} from "./groupSelection";

export function GroupProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [selection, setSelection] = useState<{
    userId: string;
    group: Group | null;
  } | null>(null);

  const activeGroup =
    !currentUser
      ? null
      : selection?.userId === currentUser.uid
        ? selection.group
        : parseActiveGroup(
            window.localStorage.getItem(activeGroupStorageKey(currentUser.uid)),
          );

  const setActiveGroup = useCallback(
    (group: Group | null) => {
      if (!currentUser) return;

      const storageKey = activeGroupStorageKey(currentUser.uid);
      setSelection({ userId: currentUser.uid, group });

      if (group) {
        window.localStorage.setItem(storageKey, serializeActiveGroup(group));
      } else {
        window.localStorage.removeItem(storageKey);
      }
    },
    [currentUser],
  );

  const value = useMemo(
    () => ({ activeGroup, setActiveGroup }),
    [activeGroup, setActiveGroup],
  );

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
}
