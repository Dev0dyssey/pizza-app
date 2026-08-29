import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../base";
import type { AppUser } from "../../auth-context";
import { demoMode } from "../../config";
import {
  type Group,
  type GroupMember,
  type GroupMembership,
  type GroupNameValidation,
  validateGroupName,
} from "./groupDomain";

export interface CreateGroupInput {
  name: string;
  owner: AppUser;
}

export class InvalidGroupNameError extends Error {
  constructor(validation: GroupNameValidation) {
    super(validation.error ?? "The group name is invalid.");
    this.name = "InvalidGroupNameError";
  }
}

let demoMemberships: GroupMembership[] = [];

function groupFromDocument(id: string, data: Record<string, unknown>): Group {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "Untitled group",
    ownerId: typeof data.ownerId === "string" ? data.ownerId : "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : undefined,
  };
}

function memberFromDocument(
  userId: string,
  data: Record<string, unknown>,
): GroupMember {
  return {
    userId,
    displayName:
      typeof data.displayName === "string" ? data.displayName : "Unknown user",
    role: data.role === "owner" ? "owner" : "member",
    joinedAt: data.joinedAt instanceof Timestamp ? data.joinedAt : undefined,
  };
}

/**
 * Lists a user's groups from the membership records, rather than exposing a
 * broad query over all groups. Firestore rules will later constrain this to
 * the signed-in user's own membership documents.
 */
export async function listGroupsForUser(
  userId: string,
): Promise<GroupMembership[]> {
  if (demoMode) {
    return demoMemberships.filter(
      (membership) => membership.member.userId === userId,
    );
  }

  const membershipSnapshot = await getDocs(
    query(
      collectionGroup(db, "members"),
      where("userId", "==", userId),
    ),
  );
  const memberships = await Promise.all(
    membershipSnapshot.docs.map(async (membershipDocument) => {
      const groupReference = membershipDocument.ref.parent.parent;

      if (!groupReference) return null;

      const groupDocument = await getDoc(groupReference);
      if (!groupDocument.exists()) return null;

      return {
        group: groupFromDocument(groupDocument.id, groupDocument.data()),
        member: memberFromDocument(userId, membershipDocument.data()),
      };
    }),
  );

  return memberships
    .filter((membership): membership is GroupMembership => membership !== null)
    .toSorted((left, right) => left.group.name.localeCompare(right.group.name));
}

/**
 * Adds the explicit userId field introduced for collection-group queries to a
 * membership created before this field existed. This is a one-time, narrowly
 * scoped repair for the active group in the current browser.
 */
export async function repairGroupMembershipUserId(
  groupId: string,
  userId: string,
): Promise<void> {
  if (demoMode) return;

  const membershipReference = doc(db, "groups", groupId, "members", userId);
  const membershipDocument = await getDoc(membershipReference);

  if (
    !membershipDocument.exists() ||
    membershipDocument.data().userId === userId
  ) {
    return;
  }

  await updateDoc(membershipReference, { userId });
}

/**
 * Creates the group and its first membership in one atomic Firestore batch.
 * Rules will later require this paired write, so a group can never be created
 * without an owner who is able to administer it.
 */
export async function createGroup({ name, owner }: CreateGroupInput): Promise<Group> {
  const validation = validateGroupName(name);

  if (validation.error) {
    throw new InvalidGroupNameError(validation);
  }

  if (demoMode) {
    const group: Group = {
      id: `demo-group-${crypto.randomUUID()}`,
      name: validation.name,
      ownerId: owner.uid,
    };

    demoMemberships = [
      ...demoMemberships,
      {
        group,
        member: {
          userId: owner.uid,
          displayName: owner.displayName || owner.email || "Unknown user",
          role: "owner",
        },
      },
    ];

    return group;
  }

  const groupReference = doc(collection(db, "groups"));
  const ownerMembershipReference = doc(
    groupReference,
    "members",
    owner.uid,
  );
  const batch = writeBatch(db);

  batch.set(groupReference, {
    name: validation.name,
    ownerId: owner.uid,
    createdAt: serverTimestamp(),
  });
  batch.set(ownerMembershipReference, {
    userId: owner.uid,
    displayName: owner.displayName || owner.email || "Unknown user",
    role: "owner",
    joinedAt: serverTimestamp(),
  });

  await batch.commit();

  return {
    id: groupReference.id,
    name: validation.name,
    ownerId: owner.uid,
  };
}
