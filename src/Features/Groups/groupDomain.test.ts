import { describe, expect, it } from "vitest";
import { MAX_GROUP_NAME_LENGTH, validateGroupName } from "./groupDomain";

describe("validateGroupName", () => {
  it("trims and normalizes spacing in a valid name", () => {
    expect(validateGroupName("  Friday   Pizza   Club ")).toEqual({
      name: "Friday Pizza Club",
      error: null,
    });
  });

  it("rejects an empty name", () => {
    expect(validateGroupName(" \t ")).toEqual({
      name: "",
      error: "Enter a group name.",
    });
  });

  it("rejects names longer than the limit", () => {
    const name = "a".repeat(MAX_GROUP_NAME_LENGTH + 1);

    expect(validateGroupName(name).error).toBe(
      `A group name can be at most ${MAX_GROUP_NAME_LENGTH} characters.`,
    );
  });
});
