import type { RatingEntry } from "../../types";

function numericValue(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function timestampValue(data: Record<string, unknown>, field: string) {
  const value = data[field];

  return value && typeof value === "object" && "toMillis" in value
    ? (value as RatingEntry["added"])
    : undefined;
}

/** Converts an authenticated, read-only root example to the shared UI model. */
export function legacyEntryToDisplayEntry(
  id: string,
  data: Record<string, unknown>,
): RatingEntry {
  return {
    id,
    owner: typeof data.owner === "string" ? data.owner : "Unknown",
    name: typeof data.name === "string" ? data.name : "Untitled",
    restaurant: typeof data.restaurant === "string" ? data.restaurant : "",
    rating: numericValue(data.rating),
    averageRatings: numericValue(data.averageRatings ?? data.rating),
    ratings: Array.isArray(data.ratings)
      ? data.ratings.map(Number).filter(Number.isFinite)
      : [],
    comment: typeof data.comment === "string" ? data.comment : "",
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : undefined,
    photo: typeof data.photo === "string" ? data.photo : undefined,
    added: timestampValue(data, "added"),
  };
}

/**
 * Adapts the group-entry schema to the existing card/detail display model.
 * Ratings are aggregate values here; individual rating records arrive in
 * increment 4 and must not be inferred from the legacy ratings array.
 */
export function groupEntryToDisplayEntry(
  id: string,
  data: Record<string, unknown>,
): RatingEntry {
  const averageRating = numericValue(
    data.averageRating ?? data.averageRatings ?? data.rating,
  );

  return {
    id,
    owner:
      typeof data.createdByDisplayName === "string"
        ? data.createdByDisplayName
        : typeof data.owner === "string"
          ? data.owner
          : "Unknown",
    name: typeof data.name === "string" ? data.name : "Untitled",
    restaurant: typeof data.restaurant === "string" ? data.restaurant : "",
    rating: averageRating,
    averageRatings: averageRating,
    ratings: [],
    comment: typeof data.comment === "string" ? data.comment : "",
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : undefined,
    photo: typeof data.photo === "string" ? data.photo : undefined,
    added: timestampValue(data, "createdAt") ?? timestampValue(data, "added"),
  };
}
