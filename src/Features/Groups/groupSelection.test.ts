import { describe, expect, it } from "vitest";
import {
  activeGroupStorageKey,
  parseActiveGroup,
  serializeActiveGroup,
} from "./groupSelection";

describe("active group selection", () => {
  const group = {
    id: "friday-pizza-club",
    name: "Friday Pizza Club",
    ownerId: "user-1",
  };

  it("keeps selections separate for each user", () => {
    expect(activeGroupStorageKey("user-1")).not.toBe(
      activeGroupStorageKey("user-2"),
    );
  });

  it("round-trips a valid group selection", () => {
    expect(parseActiveGroup(serializeActiveGroup(group))).toEqual(group);
  });

  it("ignores malformed stored selections", () => {
    expect(parseActiveGroup("not json")).toBeNull();
    expect(parseActiveGroup('{"id":"missing-fields"}')).toBeNull();
  });
});
