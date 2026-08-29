import { createContext } from "react";
import type { Group } from "./groupDomain";

export interface GroupContextValue {
  activeGroup: Group | null;
  setActiveGroup: (group: Group | null) => void;
}

export const GroupContext = createContext<GroupContextValue | undefined>(undefined);
