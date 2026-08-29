import { readFileSync } from "node:fs";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";

let testEnvironment: RulesTestEnvironment;

function ownerBatch(userId: string, groupId: string) {
  const database = testEnvironment.authenticatedContext(userId).firestore();
  const batch = database.batch();
  const groupReference = database.doc(`groups/${groupId}`);
  const memberReference = database.doc(`groups/${groupId}/members/${userId}`);

  batch.set(groupReference, {
    name: "Friday Pizza Club",
    ownerId: userId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  batch.set(memberReference, {
    userId,
    displayName: "Pizza Fan",
    role: "owner",
    joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  return batch;
}

describe("group Firestore rules", () => {
  beforeAll(async () => {
    testEnvironment = await initializeTestEnvironment({
      projectId: "demo-pizza-rate-rules",
      firestore: {
        rules: readFileSync("firestore.rules", "utf8"),
      },
    });
  });

  afterEach(async () => {
    await testEnvironment.clearFirestore();
  });

  afterAll(async () => {
    await testEnvironment.cleanup();
  });

  it("allows an authenticated user to atomically create a group and owner membership", async () => {
    const alice = testEnvironment.authenticatedContext("alice").firestore();

    await assertSucceeds(ownerBatch("alice", "friday-pizza-club").commit());
    await assertSucceeds(alice.doc("groups/friday-pizza-club").get());
  });

  it("rejects a group created without its paired owner membership", async () => {
    const alice = testEnvironment.authenticatedContext("alice").firestore();

    await assertFails(
      alice.doc("groups/incomplete-group").set({
        name: "Incomplete group",
        ownerId: "alice",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }),
    );
  });

  it("allows a user to query only their own memberships", async () => {
    await assertSucceeds(ownerBatch("alice", "friday-pizza-club").commit());
    const alice = testEnvironment.authenticatedContext("alice").firestore();
    const bob = testEnvironment.authenticatedContext("bob").firestore();

    const ownMemberships = await assertSucceeds(
      alice.collectionGroup("members").where("userId", "==", "alice").get(),
    );

    expect(ownMemberships.docs).toHaveLength(1);
    await assertFails(
      bob.collectionGroup("members").where("userId", "==", "alice").get(),
    );
  });
});
