import type { Group } from "./groupDomain";

const ACTIVE_GROUP_STORAGE_PREFIX = "pizza-rate.active-group.";

export function activeGroupStorageKey(userId: string): string {
  return `${ACTIVE_GROUP_STORAGE_PREFIX}${userId}`;
}

export function serializeActiveGroup(group: Group): string {
  return JSON.stringify({
    id: group.id,
    name: group.name,
    ownerId: group.ownerId,
  });
}

export function parseActiveGroup(value: string | null): Group | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("id" in parsed) ||
      !("name" in parsed) ||
      !("ownerId" in parsed) ||
      typeof parsed.id !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.ownerId !== "string"
    ) {
      return null;
    }

    return { id: parsed.id, name: parsed.name, ownerId: parsed.ownerId };
  } catch {
    return null;
  }
}
