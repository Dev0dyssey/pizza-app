import { describe, expect, it } from "vitest";
import {
  groupEntryToDisplayEntry,
  legacyEntryToDisplayEntry,
} from "./groupEntryDisplay";

describe("group entry display adapters", () => {
  it("uses the group creator and aggregate rating fields", () => {
    const createdAt = { toMillis: () => 123 };

    expect(
      groupEntryToDisplayEntry("margherita", {
        name: "Margherita",
        restaurant: "Pizza Place",
        createdByDisplayName: "Alice",
        averageRating: 4.5,
        ratingCount: 2,
        createdAt,
      }),
    ).toMatchObject({
      id: "margherita",
      owner: "Alice",
      averageRatings: 4.5,
      ratings: [],
      added: createdAt,
    });
  });

  it("keeps legacy rating arrays separate from group rating records", () => {
    expect(
      legacyEntryToDisplayEntry("legacy-pizza", {
        owner: "Bob",
        name: "Legacy pizza",
        rating: 3,
        ratings: [3, "4", "not-a-rating"],
      }),
    ).toMatchObject({
      id: "legacy-pizza",
      owner: "Bob",
      averageRatings: 3,
      ratings: [3, 4],
    });
  });
});
