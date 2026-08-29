import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../../auth-context";
import { useGroup } from "../../Features/Groups/useGroup";
import type { GroupMembership } from "../../Features/Groups/groupDomain";
import {
  createGroup,
  InvalidGroupNameError,
  listGroupsForUser,
  repairGroupMembershipUserId,
} from "../../Features/Groups/groupService";
import NavBar from "../../UIComponents/NavBar";

function groupsErrorMessage(error: unknown, action: "load" | "create"): string {
  if (error instanceof InvalidGroupNameError) return error.message;

  const code =
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : null;

  if (code === "permission-denied") {
    return "Firestore denied access. Deploy the My Groups security rules, then try again.";
  }

  if (code === "failed-precondition") {
    return "Firestore is not ready for this request. Confirm the default database is available, then try again.";
  }

  if (code === "unavailable" || code === "deadline-exceeded") {
    return "Could not reach Firestore. Check your connection and try again.";
  }

  return code
    ? `Could not ${action} your groups (Firebase: ${code}).`
    : `Could not ${action} your groups. Please try again.`;
}

export default function MyGroups() {
  const { currentUser } = useAuth();
  const { activeGroup, setActiveGroup } = useGroup();
  const [groups, setGroups] = useState<GroupMembership[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userId = currentUser?.uid;
    if (!userId) return;

    let mounted = true;

    async function loadGroups(groupUserId: string) {
      try {
        if (activeGroup) {
          await repairGroupMembershipUserId(activeGroup.id, groupUserId);
        }
        const memberships = await listGroupsForUser(groupUserId);
        if (!mounted) return;

        setGroups(memberships);
        if (
          activeGroup &&
          !memberships.some(({ group }) => group.id === activeGroup.id)
        ) {
          setActiveGroup(null);
        }
      } catch (loadError) {
        console.error("Could not load groups from Firestore.", loadError);
        if (mounted) setError(groupsErrorMessage(loadError, "load"));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadGroups(userId);
    return () => {
      mounted = false;
    };
  }, [activeGroup, currentUser, setActiveGroup]);

  async function handleCreateGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser) return;

    setCreating(true);
    setError("");
    setMessage("");

    try {
      const group = await createGroup({ name, owner: currentUser });
      const membership: GroupMembership = {
        group,
        member: {
          userId: currentUser.uid,
          displayName: currentUser.displayName || currentUser.email || "Unknown user",
          role: "owner",
        },
      };

      setGroups((existing) =>
        [...existing, membership].toSorted((left, right) =>
          left.group.name.localeCompare(right.group.name),
        ),
      );
      setActiveGroup(group);
      setName("");
      setMessage(`${group.name} has been created and selected.`);
    } catch (createError) {
      console.error("Could not create a group in Firestore.", createError);
      setError(groupsErrorMessage(createError, "create"));
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <NavBar />
      <section className="row g-4">
        <div className="col-lg-7">
          <h1 className="h3">My groups</h1>
          <p className="text-muted">
            Choose the group whose pizzas and ratings you want to work with.
          </p>
          {error && <p className="alert alert-danger">{error}</p>}
          {message && <p className="alert alert-success">{message}</p>}
          {loading ? (
            <p>Loading your groups…</p>
          ) : groups.length === 0 ? (
            <p className="alert alert-secondary">
              You are not in any groups yet. Create one to get started.
            </p>
          ) : (
            <div className="list-group">
              {groups.map(({ group, member }) => {
                const selected = activeGroup?.id === group.id;

                return (
                  <button
                    aria-pressed={selected}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center${selected ? " active" : ""}`}
                    key={group.id}
                    onClick={() => setActiveGroup(group)}
                    type="button"
                  >
                    <span>
                      <span className="d-block fw-semibold">{group.name}</span>
                      <small>{member.role === "owner" ? "Owner" : "Member"}</small>
                    </span>
                    {selected && <span className="badge text-bg-light">Selected</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="col-lg-5">
          <section className="card p-4">
            <h2 className="h4">Create a group</h2>
            <p className="text-muted">You will be its first owner and member.</p>
            <form onSubmit={(event) => void handleCreateGroup(event)}>
              <label className="form-label" htmlFor="group-name">
                Group name
              </label>
              <input
                autoComplete="organization"
                className="form-control mb-3"
                disabled={creating}
                id="group-name"
                maxLength={80}
                onChange={(event) => setName(event.target.value)}
                placeholder="Friday Pizza Club"
                required
                value={name}
              />
              <button className="btn btn-primary" disabled={creating} type="submit">
                {creating ? "Creating…" : "Create group"}
              </button>
            </form>
          </section>
        </div>
      </section>
    </>
  );
}
