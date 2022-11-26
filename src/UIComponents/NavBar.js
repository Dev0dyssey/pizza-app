/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { handleSignout } from "../base";

const NavBar = () => {
  return (
    <nav className="navbar sticky-top navbar-expand-lg pl-0 pr-0 navbar-light bg-white">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarToggler"
        aria-controls="navbarToggler"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarToggler">
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link active" href="/main">
              ALL PIZZAS
              <i className="fas fa-pizza-slice ms-3"></i>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/main/newpizzas">
              New Pizzas
              <i className="fas fa-fire ms-3"></i>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/main/othermeals">
              Other meals
              <i className="fas fa-utensils ms-3"></i>
            </a>
          </li>
        </ul>
      </div>
      <button className="btn btn-secondary me-1">
        <a className="nav-link" href="/main/profilesettings">
          <i className="fas fa-gear"></i>
        </a>
      </button>
      <button className="btn btn-danger" onClick={() => handleSignout()}>
        Log out
      </button>
    </nav>
  );
};

export default NavBar;
