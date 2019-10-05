import React, { useState } from "react";
import NavBar from "../UIComponents/NavBar";
import PizzaRating from "./Modals/PizzaRating";
import NewPizza from "./Modals/NewPizza";

const MainPage = props => {
  const [comment, setComment] = useState("Placeholder Comment");
  const [pizzaName, setPizza] = useState("Placeholder Pizza");
  const [pizzas, addPizza] = useState([
    {
      name: "Avocado",
      restaurant: "Domino's",
      rating: 1,
      comment: "Avocado Pizza...really?"
    },
    {
      name: "Pepperoni",
      restaurant: "Papa John's",
      rating: 3,
      comment: "Cooking with sizzle"
    },
    {
      name: "Hawaiian",
      restaurant: "Pizza Hut",
      rating: 2,
      comment: "PINEAPPLES?!"
    },
    {
      name: "HOT",
      restaurant: "Pizza Place",
      rating: 5,
      comment: "Nostrils burner!"
    }
  ]);

  const ratingDetails = val => {
    setComment(val.comment);
    setPizza(val.name);
  };

  const newPizza = val => {
    addPizza(pizzas => [...pizzas, val]);
  };

  const generateList = () => {
    pizzas.sort();
    return pizzas.map(pizza => {
      return (
        <div className="col-md-4 col-sm-1">
          <div className="card" style={{ marginBottom: "1rem" }}>
            <img
              className="card-img-top"
              src="https://bit.ly/2mtvjbu"
              alt={pizza}
            />
            <div className="card-body">
              <h3 className="card-title">
                {pizza.name}: {pizza.rating}
              </h3>
              <div className="card-text">
                <strong>Location:</strong> {pizza.restaurant}
                <br />
              </div>
              <br />
              <button
                onClick={() => ratingDetails(pizza)}
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#exampleModal"
              >
                Read more and Rate
              </button>
              <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                role="dialog"
              >
                <PizzaRating comment={comment} pizza={pizzaName} />
              </div>
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
      <br />
      <div className="row">{generateList()}</div>
      <button
        className="btn btn-primary col text-center"
        data-toggle="modal"
        data-target="#newPizza"
      >
        Add Pizza!
      </button>
      <div className="modal fade" id="newPizza" tabIndex="-1" role="dialog">
        <NewPizza newPizza={newPizza} />
      </div>
    </>
  );
};

export default MainPage;
