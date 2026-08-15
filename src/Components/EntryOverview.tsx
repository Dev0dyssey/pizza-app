import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../base";
import type {
  EntryCollection,
  EntryComment,
  EntryKind,
  RatingEntry,
} from "../types";
import NavBar from "../UIComponents/NavBar";
import DetailsModal from "./Modals/DetailsModal";
import NewEntry from "./Modals/NewEntry";
import "../StyleSheets/main.css";

interface EntryOverviewProps {
  collectionName: EntryCollection;
  kind: EntryKind;
  title?: string;
  recentOnly?: boolean;
}

function numericRating(entry: RatingEntry): number {
  return Number(entry.averageRatings ?? entry.rating) || 0;
}

function normalizeEntry(id: string, data: Record<string, unknown>): RatingEntry {
  return {
    id,
    owner: typeof data.owner === "string" ? data.owner : "Unknown",
    name: typeof data.name === "string" ? data.name : "Untitled",
    restaurant: typeof data.restaurant === "string" ? data.restaurant : "",
    rating: Number(data.rating) || 0,
    averageRatings: Number(data.averageRatings ?? data.rating) || 0,
    ratings: Array.isArray(data.ratings)
      ? data.ratings.map(Number).filter(Number.isFinite)
      : [],
    comment: typeof data.comment === "string" ? data.comment : "",
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : undefined,
    photo: typeof data.photo === "string" ? data.photo : undefined,
    added:
      data.added &&
      typeof data.added === "object" &&
      "toMillis" in data.added
        ? (data.added as RatingEntry["added"])
        : undefined,
  };
}

export default function EntryOverview({
  collectionName,
  kind,
  title,
  recentOnly = false,
}: EntryOverviewProps) {
  const [entries, setEntries] = useState<RatingEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<RatingEntry | null>(null);
  const [comments, setComments] = useState<EntryComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState("");
  const [now] = useState(Date.now);

  useEffect(() => {
    let active = true;

    async function loadEntries() {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        if (active) {
          setEntries(
            snapshot.docs.map((entryDocument) =>
              normalizeEntry(entryDocument.id, entryDocument.data()),
            ),
          );
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load entries.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadEntries();
    return () => {
      active = false;
    };
  }, [collectionName]);

  const visibleEntries = useMemo(() => {
    const dayAgo = now - 24 * 60 * 60 * 1000;
    return entries
      .filter(
        (entry) =>
          !recentOnly || (entry.added?.toMillis() ?? 0) >= dayAgo,
      )
      .toSorted((left, right) =>
        recentOnly
          ? (right.added?.toMillis() ?? 0) - (left.added?.toMillis() ?? 0)
          : numericRating(right) - numericRating(left),
      );
  }, [entries, now, recentOnly]);

  async function selectEntry(entry: RatingEntry) {
    setSelectedEntry(entry);
    setComments([]);
    setCommentsLoading(true);

    try {
      const snapshot = await getDocs(
        collection(db, collectionName, entry.id, "comments"),
      );
      setComments(
        snapshot.docs.map((commentDocument) => {
          const data = commentDocument.data();
          return {
            id: commentDocument.id,
            comment: typeof data.comment === "string" ? data.comment : "",
            userID: typeof data.userID === "string" ? data.userID : "",
          };
        }),
      );
    } catch (commentError) {
      setError(
        commentError instanceof Error
          ? commentError.message
          : "Could not load comments.",
      );
    } finally {
      setCommentsLoading(false);
    }
  }

  function updateEntry(updated: RatingEntry) {
    setSelectedEntry(updated);
    setEntries((current) =>
      current.map((entry) => (entry.id === updated.id ? updated : entry)),
    );
  }

  return (
    <>
      <NavBar />
      {title && <h1 className="h3 mb-4">{title}</h1>}
      {error && <p className="alert alert-danger">{error}</p>}
      {loading ? (
        <p>Loading entries…</p>
      ) : (
        <div className="row">
          {visibleEntries.map((entry) => {
            const image = entry.imageUrl || entry.photo;
            return (
              <div className="col-lg-4 col-sm-12 d-flex" key={entry.id}>
                <article className="card text-white mb-3 w-100 entry-card">
                  {image ? (
                    <img
                      className="card-img entry-image"
                      src={image}
                      alt={`${entry.name}${entry.restaurant ? ` from ${entry.restaurant}` : ""}`}
                    />
                  ) : (
                    <div className="entry-image entry-placeholder" aria-hidden="true" />
                  )}
                  <div className="card-img-overlay d-flex flex-column">
                    <span className="badge rounded-pill bg-primary rating-badge">
                      {numericRating(entry).toFixed(1)}
                    </span>
                    <button
                      type="button"
                      onClick={() => void selectEntry(entry)}
                      className="mainBTN mt-auto btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#detailsModal"
                    >
                      {entry.name}
                    </button>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      )}
      {!loading && visibleEntries.length === 0 && (
        <p className="text-muted">No entries to show yet.</p>
      )}
      <button
        type="button"
        className="btn btn-primary w-100"
        data-bs-toggle="modal"
        data-bs-target="#newEntryModal"
      >
        Add {kind}
      </button>

      <div
        className="modal fade"
        id="detailsModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        {selectedEntry && (
          <DetailsModal
            key={selectedEntry.id}
            collectionName={collectionName}
            entry={selectedEntry}
            comments={comments}
            commentsLoading={commentsLoading}
            onCommentsChange={setComments}
            onEntryChange={updateEntry}
          />
        )}
      </div>

      <div
        className="modal fade"
        id="newEntryModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <NewEntry
          collectionName={collectionName}
          kind={kind}
          modalId="newEntryModal"
          onCreated={(entry) => setEntries((current) => [...current, entry])}
        />
      </div>
    </>
  );
}
