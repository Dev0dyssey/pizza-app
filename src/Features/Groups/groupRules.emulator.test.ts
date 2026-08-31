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

async function seedDocument(path: string, data: Record<string, unknown>) {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await context.firestore().doc(path).set(data);
  });
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

  it("allows signed-in users to read but never change legacy examples", async () => {
    await seedDocument("pizza-collection/legacy-margherita", {
      name: "Legacy Margherita",
    });
    await seedDocument("pizza-collection/legacy-margherita/comments/comment-1", {
      comment: "Classic.",
      userID: "alice",
    });

    const alice = testEnvironment.authenticatedContext("alice").firestore();
    const anonymous = testEnvironment.unauthenticatedContext().firestore();

    await assertSucceeds(alice.collection("pizza-collection").get());
    await assertSucceeds(
      alice.doc("pizza-collection/legacy-margherita/comments/comment-1").get(),
    );
    await assertFails(
      anonymous.doc("pizza-collection/legacy-margherita").get(),
    );
    await assertFails(
      alice.doc("pizza-collection/legacy-margherita").update({ name: "Changed" }),
    );
  });

  it("allows group members to read only entries and comments in their group", async () => {
    await assertSucceeds(ownerBatch("alice", "alice-group").commit());
    await assertSucceeds(ownerBatch("bob", "bob-group").commit());
    await seedDocument("groups/alice-group/pizzas/margherita", {
      name: "Alice's Margherita",
      createdByUserId: "alice",
    });
    await seedDocument("groups/alice-group/pizzas/margherita/comments/comment-1", {
      body: "Great crust.",
      createdByUserId: "alice",
    });

    const alice = testEnvironment.authenticatedContext("alice").firestore();
    const bob = testEnvironment.authenticatedContext("bob").firestore();

    await assertSucceeds(alice.collection("groups/alice-group/pizzas").get());
    await assertSucceeds(
      alice.doc("groups/alice-group/pizzas/margherita/comments/comment-1").get(),
    );
    await assertFails(bob.collection("groups/alice-group/pizzas").get());
    await assertFails(
      bob.doc("groups/alice-group/pizzas/margherita/comments/comment-1").get(),
    );
    await assertFails(
      alice.doc("groups/alice-group/pizzas/margherita").update({ name: "Changed" }),
    );
  });
});
