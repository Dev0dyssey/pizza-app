import React, { useState, useEffect } from "react";
import NavBar from "../UIComponents/NavBar";
import PizzaRating from "./Modals/PizzaRating";
import NewPizza from "./Modals/NewPizza";
import { db } from '../base';

const MainPage = props => {

  const [comment, setComment] = useState("Placeholder Comment");
  const [pizzaName, setPizza] = useState("Placeholder Pizza");
  const [pizzaList, setList] = useState([]);

  const ratingDetails = val => {
    setComment(val.comment);
    setPizza(val.name);
  };

  useEffect(() => {
    db.collection('pizza-collection').get().then(querySnapshot => {
      querySnapshot.forEach((doc) => {
      setList(pizzaList => [...pizzaList, doc.data()])
      });
    });
  }, [])

  const generateList = () => {
    pizzaList.sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating));
    return pizzaList.map((pizza, index) => {
      return (
        <div className="col-md-4 col-sm-1 d-flex" key={index}>
          <div className="card text-white" style={{ marginBottom: "1rem" }}>
              <img
                className="card-img-top"
                src={pizza.photo}
                alt={pizza}
                style={{ width: "100%", height: "100%"}}
              />
            <div className="card-img-overlay d-flex flex-column">
              <h3 className="mt-auto card-title">
                {pizza.name}: {pizza.rating}
              </h3>
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
      <h3>List of ranked pizzas</h3>
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
        <NewPizza />
      </div>
    </>
  );
};

export default MainPage;
