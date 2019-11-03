/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import app from '../base';

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg pl-0 navbar-light">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarToggler"
        aria-controls="navbarToggler"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarToggler">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" href="/main">
              ALL PIZZAS
              <i className="fas fa-pizza-slice ml-3"></i>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/main/newpizzas">
              New Pizzas
              <i className="fas fa-fire ml-3"></i>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Other meals
              <i className="fas fa-utensils ml-3"></i>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              The twilight zone
              <i className="fas fa-biohazard ml-3"></i>
            </a>
          </li>
        </ul>
        <button className="btn btn-danger" onClick={() => app.auth().signOut()}>Log out</button>
      </div>
    </nav>
  );
};

export default NavBar;