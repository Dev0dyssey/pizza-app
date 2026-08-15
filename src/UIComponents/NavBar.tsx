import { NavLink, useNavigate } from "react-router-dom";
import { handleSignout } from "../base";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link${isActive ? " active" : ""}`;

export default function NavBar() {
  const navigate = useNavigate();

  async function signOut() {
    await handleSignout();
    navigate("/", { replace: true });
  }

  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-white mb-3">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#primaryNavigation"
        aria-controls="primaryNavigation"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="primaryNavigation">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <NavLink end className={linkClass} to="/main">
              All pizzas
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={linkClass} to="/main/newpizzas">
              New pizzas
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={linkClass} to="/main/othermeals">
              Other meals
            </NavLink>
          </li>
        </ul>
      </div>
      <NavLink className="btn btn-outline-secondary me-2" to="/main/profilesettings">
        Profile
      </NavLink>
      <button className="btn btn-danger" type="button" onClick={() => void signOut()}>
        Log out
      </button>
    </nav>
  );
}
