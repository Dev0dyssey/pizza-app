import type { Timestamp } from "firebase/firestore";

export type EntryCollection = "pizza-collection" | "other-meals";
export type EntryKind = "pizza" | "meal";

export interface RatingEntry {
  id: string;
  owner: string;
  name: string;
  restaurant: string;
  rating: number;
  ratings: number[];
  averageRatings: number;
  comment: string;
  imageUrl?: string;
  photo?: string;
  added?: Timestamp;
}

export interface EntryComment {
  id: string;
  comment: string;
  userID: string;
}
