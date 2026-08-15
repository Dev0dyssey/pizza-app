import { useEffect, useRef, useState, type FormEvent } from "react";
import { Modal } from "bootstrap";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import {
  getDownloadURL,
  ref as storageReference,
  uploadBytes,
} from "firebase/storage";
import { useAuth } from "../../auth-context";
import { db, storage } from "../../base";
import type {
  EntryCollection,
  EntryKind,
  RatingEntry,
} from "../../types";

interface NewEntryProps {
  collectionName: EntryCollection;
  kind: EntryKind;
  modalId: string;
  onCreated: (entry: RatingEntry) => void;
}

const ratingOptions = [1, 2, 3, 4, 5] as const;

export default function NewEntry({
  collectionName,
  kind,
  modalId,
  onCreated,
}: NewEntryProps) {
  const { currentUser } = useAuth();
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  function selectFile(selectedFile: File | null) {
    if (preview) URL.revokeObjectURL(preview);
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : "");
  }

  function resetForm(form?: HTMLFormElement) {
    form?.reset();
    selectFile(null);
    setRating(null);
    setError("");
    if (fileInput.current) fileInput.current.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser || !file || rating === null) return;

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSubmitting(true);
    setError("");

    try {
      const imagePath = `images/${currentUser.uid}/${crypto.randomUUID()}-${file.name}`;
      const imageReference = storageReference(storage, imagePath);
      await uploadBytes(imageReference, file, { contentType: file.type });
      const imageUrl = await getDownloadURL(imageReference);
      const added = Timestamp.now();
      const entryData = {
        owner: currentUser.displayName || currentUser.email || "Unknown",
        name: String(form.get("name")).trim(),
        restaurant: String(form.get("restaurant")).trim(),
        rating,
        ratings: [rating],
        averageRatings: rating,
        comment: String(form.get("comment")).trim(),
        imageUrl,
        added,
      };
      const entryReference = await addDoc(collection(db, collectionName), entryData);

      onCreated({ id: entryReference.id, ...entryData });
      resetForm(formElement);
      const modalElement = document.getElementById(modalId);
      if (modalElement) Modal.getOrCreateInstance(modalElement).hide();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : `Could not add the ${kind}.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-dialog modal-dialog-scrollable">
      <form className="modal-content" onSubmit={(event) => void handleSubmit(event)}>
        <div className="modal-header">
          <h2 className="modal-title fs-5">New {kind}</h2>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor={`entry-name-${kind}`}>
              Name
            </label>
            <input
              required
              name="name"
              type="text"
              className="form-control"
              id={`entry-name-${kind}`}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor={`restaurant-${kind}`}>
              Restaurant
            </label>
            <input
              required
              name="restaurant"
              type="text"
              className="form-control"
              id={`restaurant-${kind}`}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor={`image-${kind}`}>
              Image
            </label>
            <input
              required
              ref={fileInput}
              type="file"
              accept="image/*"
              className="form-control"
              id={`image-${kind}`}
              onChange={(event) => selectFile(event.target.files?.[0] ?? null)}
            />
          </div>
          {preview && (
            <img className="img-fluid rounded mb-3 preview-image" src={preview} alt="Upload preview" />
          )}
          <div className="mb-3">
            <label className="form-label" htmlFor={`comment-${kind}`}>
              Comment
            </label>
            <textarea
              required
              name="comment"
              className="form-control"
              rows={4}
              id={`comment-${kind}`}
            />
          </div>
          <fieldset>
            <legend className="fs-6">Rating</legend>
            {ratingOptions.map((value) => {
              const id = `new-${kind}-rating-${value}`;
              return (
                <div className="form-check form-check-inline" key={value}>
                  <input
                    required
                    className="form-check-input"
                    type="radio"
                    name="rating"
                    id={id}
                    checked={rating === value}
                    onChange={() => setRating(value)}
                  />
                  <label className="form-check-label" htmlFor={id}>
                    {value}
                  </label>
                </div>
              );
            })}
          </fieldset>
          {error && <p className="alert alert-danger mt-3 mb-0">{error}</p>}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            onClick={() => resetForm()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || !file || rating === null}
          >
            {submitting ? "Saving…" : `Add ${kind}`}
          </button>
        </div>
      </form>
    </div>
  );
}
