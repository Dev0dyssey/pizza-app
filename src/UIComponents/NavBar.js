/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand pl-0">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a className="nav-link active" href="#">
            ALL PIZZAS
            <i className="fas fa-pizza-slice ml-3"></i>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
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
    </nav>
    /*
    <nav className="nav">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active" href="#">
            ALL PIZZAS
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">
            New Pizzas
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">
            Other meals
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">
            The twilight zone
          </a>
        </li>
      </ul>
    </nav>
    */
  );
};

export default NavBar;
