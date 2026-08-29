import { useContext } from "react";
import { GroupContext, type GroupContextValue } from "./groupContext";

export function useGroup(): GroupContextValue {
  const context = useContext(GroupContext);

  if (!context) {
    throw new Error("useGroup must be used within a GroupProvider.");
  }

  return context;
}
