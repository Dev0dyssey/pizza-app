import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../base";
import { demoMode } from "../config";
import {
  groupEntryToDisplayEntry,
  legacyEntryToDisplayEntry,
} from "../Features/Groups/groupEntryDisplay";
import {
  groupEntriesCollectionPath,
  groupEntryCommentsCollectionPath,
} from "../Features/Groups/groupPaths";
import { useGroup } from "../Features/Groups/useGroup";
import type {
  EntryCollection,
  EntryComment,
  EntryKind,
  RatingEntry,
} from "../types";
import NavBar from "../UIComponents/NavBar";
import DetailsModal from "./Modals/DetailsModal";
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

function demoEntries(collectionName: EntryCollection): RatingEntry[] {
  const added = Timestamp.now();

  if (collectionName === "other-meals") {
    return [
      {
        id: "demo-meal",
        owner: "Demo User",
        name: "Truffle pasta",
        restaurant: "The Demo Kitchen",
        rating: 4,
        ratings: [4],
        averageRatings: 4,
        comment: "A sample meal available while Firebase is disconnected.",
        imageUrl: "/logo512.png",
        added,
      },
    ];
  }

  return [
    {
      id: "demo-margherita",
      owner: "Demo User",
      name: "Margherita",
      restaurant: "The Demo Pizzeria",
      rating: 4.5,
      ratings: [4, 5],
      averageRatings: 4.5,
      comment: "A sample pizza available while Firebase is disconnected.",
      imageUrl: "/logo512.png",
      added,
    },
    {
      id: "demo-pepperoni",
      owner: "Demo User",
      name: "Pepperoni",
      restaurant: "Local Slice",
      rating: 4,
      ratings: [4],
      averageRatings: 4,
      comment: "Demo data is kept only in this browser session.",
      imageUrl: "/logo192.png",
      added,
    },
  ];
}

type EntrySource = "group" | "legacy";

interface SelectedEntry {
  entry: RatingEntry;
  source: EntrySource;
}

function visibleEntries(
  entries: RatingEntry[],
  recentOnly: boolean,
  now: number,
): RatingEntry[] {
  const dayAgo = now - 24 * 60 * 60 * 1000;

  return entries
    .filter(
      (entry) => !recentOnly || (entry.added?.toMillis() ?? 0) >= dayAgo,
    )
    .toSorted((left, right) =>
      recentOnly
        ? (right.added?.toMillis() ?? 0) - (left.added?.toMillis() ?? 0)
        : numericRating(right) - numericRating(left),
    );
}

export default function EntryOverview({
  collectionName,
  kind,
  title,
  recentOnly = false,
}: EntryOverviewProps) {
  const { activeGroup } = useGroup();
  const [groupEntries, setGroupEntries] = useState<RatingEntry[]>([]);
  const [loadedGroupId, setLoadedGroupId] = useState<string | null>(null);
  const [legacyEntries, setLegacyEntries] = useState<RatingEntry[]>(() =>
    demoMode ? demoEntries(collectionName) : [],
  );
  const [selectedEntry, setSelectedEntry] = useState<SelectedEntry | null>(null);
  const [comments, setComments] = useState<EntryComment[]>([]);
  const [groupLoading, setGroupLoading] = useState(false);
  const [legacyLoading, setLegacyLoading] = useState(!demoMode);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState("");
  const [now] = useState(Date.now);

  useEffect(() => {
    if (demoMode) return;

    let active = true;

    async function loadLegacyEntries() {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        if (active) {
          setLegacyEntries(
            snapshot.docs.map((entryDocument) =>
              legacyEntryToDisplayEntry(
                entryDocument.id,
                entryDocument.data(),
              ),
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
        if (active) setLegacyLoading(false);
      }
    }

    void loadLegacyEntries();
    return () => {
      active = false;
    };
  }, [collectionName]);

  useEffect(() => {
    const groupId = activeGroup?.id;
    if (demoMode || !groupId) return;
    const selectedGroupId = groupId;

    let active = true;

    async function loadGroupEntries() {
      setGroupLoading(true);

      try {
        const snapshot = await getDocs(
          collection(db, groupEntriesCollectionPath(selectedGroupId, kind)),
        );
        if (active) {
          setGroupEntries(
            snapshot.docs.map((entryDocument) =>
              groupEntryToDisplayEntry(
                entryDocument.id,
                entryDocument.data(),
              ),
            ),
          );
          setLoadedGroupId(selectedGroupId);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load group entries.",
          );
        }
      } finally {
        if (active) setGroupLoading(false);
      }
    }

    void loadGroupEntries();
    return () => {
      active = false;
    };
  }, [activeGroup?.id, kind]);

  const visibleGroupEntries = useMemo(
    () =>
      activeGroup?.id === loadedGroupId
        ? visibleEntries(groupEntries, recentOnly, now)
        : [],
    [activeGroup?.id, groupEntries, loadedGroupId, now, recentOnly],
  );
  const visibleLegacyEntries = useMemo(
    () => visibleEntries(legacyEntries, false, now),
    [legacyEntries, now],
  );

  async function selectEntry(entry: RatingEntry, source: EntrySource) {
    setSelectedEntry({ entry, source });
    setComments(
      demoMode
        ? [
            {
              id: `demo-comment-${entry.id}`,
              comment: "This is a local demo comment.",
              userID: "demo-user",
            },
          ]
        : [],
    );
    setCommentsLoading(!demoMode);

    if (demoMode) return;

    try {
      const commentsPath =
        source === "group" && activeGroup
          ? groupEntryCommentsCollectionPath(activeGroup.id, kind, entry.id)
          : `${collectionName}/${entry.id}/comments`;
      const snapshot = await getDocs(collection(db, commentsPath));
      setComments(
        snapshot.docs.map((commentDocument) => {
          const data = commentDocument.data();
          return {
            id: commentDocument.id,
            comment:
              typeof data.body === "string"
                ? data.body
                : typeof data.comment === "string"
                  ? data.comment
                  : "",
            userID:
              typeof data.createdByUserId === "string"
                ? data.createdByUserId
                : typeof data.userID === "string"
                  ? data.userID
                  : "",
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

  return (
    <>
      <NavBar />
      {title && <h1 className="h3 mb-4">{title}</h1>}
      {demoMode && (
        <p className="alert alert-info">
          Demo mode is active. Firebase is disabled and changes are kept only in memory.
        </p>
      )}
      {error && <p className="alert alert-danger">{error}</p>}
      {!activeGroup ? (
        <section className="alert alert-secondary" aria-live="polite">
          Select a group from the navigation or <a href="/main/groups">My groups</a>{" "}
          to view its {kind === "pizza" ? "pizzas" : "meals"}.
        </section>
      ) : (
        <section aria-labelledby="group-entries-title">
          <h2 className="h4" id="group-entries-title">
            {activeGroup.name}
          </h2>
          {groupLoading ? (
            <p>Loading group entries…</p>
          ) : visibleGroupEntries.length === 0 ? (
            <p className="text-muted">No group entries to show yet.</p>
          ) : (
            <EntryCards
              entries={visibleGroupEntries}
              onSelect={(entry) => void selectEntry(entry, "group")}
            />
          )}
        </section>
      )}
      <section aria-labelledby="legacy-entries-title">
        <h2 className="h4 mt-4" id="legacy-entries-title">
          Shared examples (read only)
        </h2>
        <p className="text-muted">
          These pre-group entries are available to signed-in users and cannot be changed.
        </p>
        {legacyLoading ? (
          <p>Loading shared examples…</p>
        ) : visibleLegacyEntries.length === 0 ? (
          <p className="text-muted">No shared examples to show.</p>
        ) : (
          <EntryCards
            entries={visibleLegacyEntries}
            onSelect={(entry) => void selectEntry(entry, "legacy")}
          />
        )}
      </section>

      <div
        className="modal fade"
        id="detailsModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          {selectedEntry && (
            <DetailsModal
              key={`${selectedEntry.source}-${selectedEntry.entry.id}`}
              collectionName={collectionName}
              entry={selectedEntry.entry}
              comments={comments}
              commentsLoading={commentsLoading}
              onCommentsChange={setComments}
              onEntryChange={() => undefined}
              readOnly
            />
          )}
        </div>
      </div>
    </>
  );
}

function EntryCards({
  entries,
  onSelect,
}: {
  entries: RatingEntry[];
  onSelect: (entry: RatingEntry) => void;
}) {
  return (
    <div className="row">
      {entries.map((entry) => {
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
                  onClick={() => onSelect(entry)}
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
  );
}
