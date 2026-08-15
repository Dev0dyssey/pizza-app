import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../base";
import type { AppUser } from "../../auth-context";
import {
  type Group,
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
