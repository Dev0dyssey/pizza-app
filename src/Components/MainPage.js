import React, { useState, useContext, useEffect } from "react";
import NavBar from "../UIComponents/NavBar";
import PizzaRating from "./Modals/PizzaRating";
import NewPizza from "./Modals/NewPizza";
import app from '../base';
import { db } from '../base';

import { AuthContext } from '../Auth';

const testArr = [];

const MainPage = props => {
  const {currentUser} = useContext(AuthContext);
  const getUserData = () => {
    let ref = app.database().ref('/');
    ref.on('value', snapshot => {
      const test = snapshot.val();
      console.log(`DATA IS: ${test}`)
    });
  }

  const [comment, setComment] = useState("Placeholder Comment");
  const [pizzaName, setPizza] = useState("Placeholder Pizza");
  const [pizzas, addPizza] = useState([
    {
      name: "Avocado",
      photo: "https://bit.ly/2mtvjbu",
      restaurant: "Domino's",
      rating: 1,
      comment: "Avocado Pizza...really?"
    },
    {
      name: "Pepperoni",
      photo: "https://bit.ly/2mtvjbu",
      restaurant: "Papa John's",
      rating: 3,
      comment: "Cooking with sizzle"
    },
    {
      name: "Hawaiian",
      photo: "https://bit.ly/2mtvjbu",
      restaurant: "Pizza Hut",
      rating: 2,
      comment: "PINEAPPLES?!"
    },
    {
      name: "HOT",
      photo: "https://bit.ly/2mtvjbu",
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
    pizzas.sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating));
    return pizzas.map((pizza, index) => {
      return (
        <div className="col-md-4 col-sm-1 d-flex" key={index}>
          <div className="card" style={{ marginBottom: "1rem" }}>
              <img
                className="card-img-top"
                src={pizza.photo}
                alt={pizza}
                style={{ width: "100%", height: "auto"}}
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

  useEffect(() => {
    db.collection('pizza-collection').get().then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        testArr.push(doc.data())
        console.log(testArr);
        // console.log(doc.id, "IS SOME DATA =>", doc.data());
      });
    });
  }, [])

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
        <NewPizza newPizza={newPizza} />
      </div>
    </>
  );
};

export default MainPage;
