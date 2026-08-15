import { useAuth } from "../../auth-context";
import NavBar from "../../UIComponents/NavBar";

export default function ProfileSettings() {
  const { currentUser } = useAuth();

  return (
    <>
      <NavBar />
      <section className="card p-4">
        <h1 className="h3">Profile</h1>
        <dl className="mb-0">
          <dt>Name</dt>
          <dd>{currentUser?.displayName || "Not set"}</dd>
          <dt>Email</dt>
          <dd>{currentUser?.email}</dd>
        </dl>
      </section>
    </>
  );
}
