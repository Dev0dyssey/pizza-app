import React from "react";
import NavBar from "../UIComponents/NavBar";

const MainPage = (props) => {
  const pizzas = ["Avocado", "Pepperoni", "Hawaiian", "HOT"];

  const generateList = () => {
    pizzas.sort();
    return pizzas.map(pizza => {
      return (
        <div className="col-4">
          <div className="card" style={{ marginBottom: "1rem" }}>
            <img
              className="card-img-top"
              src="https://bit.ly/2mtvjbu"
              alt={pizza}
            />
            <div className="card-body">
              <h3 className="card-title">{pizza}</h3>
              <p className="card-text">Some info about this pizza {props.user.tag}</p>
              <a href="#" className="btn btn-primary">
                Read more and Rate
              </a>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <NavBar />
      <h3>List of ranked pizzas(no specific order)</h3>
      <br/>
      <div className="row">{generateList()}</div>
    </>
  );
};

export default MainPage;
