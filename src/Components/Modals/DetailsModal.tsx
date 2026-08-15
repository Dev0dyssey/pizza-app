import { useState, type FormEvent } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../../auth-context";
import { db } from "../../base";
import { calculateAverage } from "../../Helpers/calculateAverage";
import type {
  EntryCollection,
  EntryComment,
  RatingEntry,
} from "../../types";
import "../../StyleSheets/modal.scss";

interface DetailsModalProps {
  collectionName: EntryCollection;
  entry: RatingEntry;
  comments: EntryComment[];
  commentsLoading: boolean;
  onCommentsChange: (comments: EntryComment[]) => void;
  onEntryChange: (entry: RatingEntry) => void;
}

const ratingOptions = [1, 2, 3, 4, 5] as const;

export default function DetailsModal({
  collectionName,
  entry,
  comments,
  commentsLoading,
  onCommentsChange,
  onEntryChange,
}: DetailsModalProps) {
  const { currentUser } = useAuth();
  const [addedComment, setAddedComment] = useState("");
  const [addedRating, setAddedRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const average = calculateAverage(entry.ratings);
  const displayedAverage = average || entry.averageRatings || entry.rating;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser || addedRating === null || !addedComment.trim()) return;

    setSubmitting(true);
    setError("");
    try {
      const ratings = [...entry.ratings, addedRating];
      const nextAverage = calculateAverage(ratings);
      const commentReference = await addDoc(
        collection(db, collectionName, entry.id, "comments"),
        { comment: addedComment.trim(), userID: currentUser.uid },
      );
      await updateDoc(doc(db, collectionName, entry.id), {
        rating: nextAverage,
        ratings,
        averageRatings: nextAverage,
      });

      onCommentsChange([
        ...comments,
        {
          id: commentReference.id,
          comment: addedComment.trim(),
          userID: currentUser.uid,
        },
      ]);
      onEntryChange({
        ...entry,
        rating: nextAverage,
        ratings,
        averageRatings: nextAverage,
      });
      setAddedComment("");
      setAddedRating(null);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save your rating.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteComment(comment: EntryComment) {
    setError("");
    try {
      await deleteDoc(
        doc(db, collectionName, entry.id, "comments", comment.id),
      );
      onCommentsChange(comments.filter(({ id }) => id !== comment.id));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete the comment.",
      );
    }
  }

  return (
    <div className="modal-dialog modal-dialog-scrollable">
      <form className="modal-content" onSubmit={(event) => void handleSubmit(event)}>
        <div className="modal-header">
          <h2 className="modal-title fs-5">Rating details for {entry.name}</h2>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <p>
            <strong>Added by:</strong> {entry.owner}
          </p>
          {entry.restaurant && (
            <p>
              <strong>Restaurant:</strong> {entry.restaurant}
            </p>
          )}
          <p>
            <strong>Average rating:</strong>{" "}
            {displayedAverage ? displayedAverage.toFixed(2) : "No ratings yet"}
          </p>
          {entry.comment && <p>{entry.comment}</p>}

          <fieldset className="mb-3">
            <legend className="fs-6">Your rating</legend>
            {ratingOptions.map((value) => {
              const id = `rating-${entry.id}-${value}`;
              return (
                <div className="form-check form-check-inline" key={value}>
                  <input
                    required
                    className="form-check-input"
                    type="radio"
                    name={`rating-${entry.id}`}
                    id={id}
                    value={value}
                    checked={addedRating === value}
                    onChange={() => setAddedRating(value)}
                  />
                  <label className="form-check-label" htmlFor={id}>
                    {value}
                  </label>
                </div>
              );
            })}
          </fieldset>

          <section aria-labelledby="comments-title">
            <h3 className="fs-5" id="comments-title">
              Comments
            </h3>
            {commentsLoading ? (
              <p>Loading comments…</p>
            ) : comments.length ? (
              <ul className="list-group mb-3">
                {comments.map((comment) => (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={comment.id}
                  >
                    <span>{comment.comment}</span>
                    {comment.userID === currentUser?.uid && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => void deleteComment(comment)}
                        aria-label={`Delete comment: ${comment.comment}`}
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No comments yet.</p>
            )}
          </section>

          <label htmlFor={`comment-${entry.id}`} className="form-label">
            Add a comment
          </label>
          <textarea
            required
            className="form-control"
            id={`comment-${entry.id}`}
            value={addedComment}
            onChange={(event) => setAddedComment(event.target.value)}
          />
          {error && <p className="alert alert-danger mt-3 mb-0">{error}</p>}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || addedRating === null || !addedComment.trim()}
          >
            {submitting ? "Saving…" : "Add rating and comment"}
          </button>
        </div>
      </form>
    </div>
  );
}
