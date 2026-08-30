import { describe, expect, it } from "vitest";
import {
  groupDocumentPath,
  groupEntriesCollectionPath,
  groupEntryCommentsCollectionPath,
  groupEntryRatingsCollectionPath,
  groupMemberDocumentPath,
} from "./groupPaths";

describe("group Firestore paths", () => {
  it("builds canonical paths below the selected group", () => {
    expect(groupDocumentPath("friday-club")).toBe("groups/friday-club");
    expect(groupMemberDocumentPath("friday-club", "alice")).toBe(
      "groups/friday-club/members/alice",
    );
    expect(groupEntriesCollectionPath("friday-club", "pizza")).toBe(
      "groups/friday-club/pizzas",
    );
    expect(groupEntryRatingsCollectionPath("friday-club", "meal", "ramen")).toBe(
      "groups/friday-club/meals/ramen/ratings",
    );
    expect(groupEntryCommentsCollectionPath("friday-club", "pizza", "margherita")).toBe(
      "groups/friday-club/pizzas/margherita/comments",
    );
  });

  it("rejects empty or multi-segment identifiers", () => {
    expect(() => groupDocumentPath(" ")).toThrow("Group ID");
    expect(() => groupMemberDocumentPath("friday-club", "alice/admin")).toThrow(
      "User ID",
    );
    expect(() => groupEntryRatingsCollectionPath("friday-club", "pizza", "a/b")).toThrow(
      "Entry ID",
    );
  });
});
