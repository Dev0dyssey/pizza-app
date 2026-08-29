import type { Timestamp } from "firebase/firestore";

export const MAX_GROUP_NAME_LENGTH = 80;

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
