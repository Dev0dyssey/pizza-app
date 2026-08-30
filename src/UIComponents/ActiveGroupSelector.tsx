import { useEffect, useState } from "react";
import { useAuth } from "../auth-context";
import type { GroupMembership } from "../Features/Groups/groupDomain";
import { listGroupsForUser } from "../Features/Groups/groupService";
import { useGroup } from "../Features/Groups/useGroup";

function groupLoadMessage(error: unknown): string {
  const code =
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : null;

  return code === "permission-denied"
    ? "Could not load your groups."
    : "Group selection is unavailable right now.";
}

export default function ActiveGroupSelector() {
  const { currentUser } = useAuth();
  const { activeGroup, setActiveGroup } = useGroup();
  const [groups, setGroups] = useState<GroupMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = currentUser?.uid;
    if (!userId) return;

    let mounted = true;

    void listGroupsForUser(userId)
      .then((memberships) => {
        if (mounted) setGroups(memberships);
      })
      .catch((loadError: unknown) => {
        if (mounted) setError(groupLoadMessage(loadError));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [currentUser?.uid]);

  const selectedGroupId = activeGroup?.id ?? "";

  return (
    <div className="d-flex align-items-center gap-2 me-lg-3">
      <label className="visually-hidden" htmlFor="active-group">
        Active group
      </label>
      <select
        aria-describedby={error ? "active-group-error" : undefined}
        aria-label="Active group"
        className="form-select form-select-sm"
        disabled={loading || Boolean(error)}
        id="active-group"
        onChange={(event) => {
          const group = groups.find(
            ({ group: option }) => option.id === event.target.value,
          );
          setActiveGroup(group?.group ?? null);
        }}
        value={selectedGroupId}
      >
        <option value="">
          {loading ? "Loading groups…" : "Select a group"}
        </option>
        {groups.map(({ group }) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-danger small" id="active-group-error" role="status">
          {error}
        </span>
      )}
    </div>
  );
}
