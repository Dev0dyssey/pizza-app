import type { Timestamp } from "firebase/firestore";

export const MAX_GROUP_NAME_LENGTH = 80;
export const GROUPS_COLLECTION = "groups";
export const GROUP_ENTRY_COLLECTIONS = {
  pizza: "pizzas",
  meal: "meals",
} as const;

export type GroupEntryKind = keyof typeof GROUP_ENTRY_COLLECTIONS;
export type GroupEntryCollection =
  (typeof GROUP_ENTRY_COLLECTIONS)[GroupEntryKind];

export interface Group {
  id: string;
  name: string;
  ownerId: string;
  createdAt?: Timestamp;
}

export interface GroupMember {
  userId: string;
  displayName: string;
  role: "owner" | "member";
  joinedAt?: Timestamp;
}

export interface GroupMembership {
  group: Group;
  member: GroupMember;
}

/**
 * The entry shape used below a group. Root-level RatingEntry records remain a
 * legacy, read-only example until the scoped read migration is complete.
 */
export interface GroupEntry {
  id: string;
  groupId: string;
  kind: GroupEntryKind;
  name: string;
  restaurant: string;
  imageUrl?: string;
  createdByUserId: string;
  createdByDisplayName: string;
  createdAt?: Timestamp;
  ratingCount: number;
  ratingTotal: number;
  averageRating: number;
}

/** A member's single editable rating for one group entry. */
export interface GroupEntryRating {
  userId: string;
  value: number;
  updatedAt?: Timestamp;
}

/** A comment stored below one group entry. */
export interface GroupEntryComment {
  id: string;
  body: string;
  createdByUserId: string;
  createdByDisplayName: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface GroupNameValidation {
  name: string;
  error: string | null;
}

export function validateGroupName(value: string): GroupNameValidation {
  const name = value.trim().replace(/\s+/g, " ");

  if (!name) {
    return { name, error: "Enter a group name." };
  }

  if (name.length > MAX_GROUP_NAME_LENGTH) {
    return {
      name,
      error: `A group name can be at most ${MAX_GROUP_NAME_LENGTH} characters.`,
    };
  }

  return { name, error: null };
}
