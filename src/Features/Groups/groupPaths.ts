import {
  GROUPS_COLLECTION,
  GROUP_ENTRY_COLLECTIONS,
  type GroupEntryKind,
} from "./groupDomain";

function pathSegment(value: string, label: string): string {
  if (!value.trim() || value.includes("/")) {
    throw new Error(`${label} must be a non-empty Firestore path segment.`);
  }

  return value;
}

export function groupDocumentPath(groupId: string): string {
  return `${GROUPS_COLLECTION}/${pathSegment(groupId, "Group ID")}`;
}

export function groupMembersCollectionPath(groupId: string): string {
  return `${groupDocumentPath(groupId)}/members`;
}

export function groupMemberDocumentPath(
  groupId: string,
  userId: string,
): string {
  return `${groupMembersCollectionPath(groupId)}/${pathSegment(userId, "User ID")}`;
}

export function groupEntriesCollectionPath(
  groupId: string,
  kind: GroupEntryKind,
): string {
  return `${groupDocumentPath(groupId)}/${GROUP_ENTRY_COLLECTIONS[kind]}`;
}

export function groupEntryDocumentPath(
  groupId: string,
  kind: GroupEntryKind,
  entryId: string,
): string {
  return `${groupEntriesCollectionPath(groupId, kind)}/${pathSegment(entryId, "Entry ID")}`;
}

export function groupEntryRatingsCollectionPath(
  groupId: string,
  kind: GroupEntryKind,
  entryId: string,
): string {
  return `${groupEntryDocumentPath(groupId, kind, entryId)}/ratings`;
}

export function groupEntryCommentsCollectionPath(
  groupId: string,
  kind: GroupEntryKind,
  entryId: string,
): string {
  return `${groupEntryDocumentPath(groupId, kind, entryId)}/comments`;
}
