import React, { useState, useEffect } from "react";
import NavBar from "../../UIComponents/NavBar";
import PizzaRating from "../Modals/PizzaRating";
import NewPizza from "../Modals/NewPizza";
import { db } from '../../base';

import '../../StyleSheets/main.css'

const MainPage = props => {

  const [comment, setComment] = useState("Placeholder Comment");
  const [pizzaName, setPizza] = useState("Placeholder Pizza");
  const [pizzaList, setList] = useState([]);
  const [dateArr, setDate] = useState([])

  useEffect(() => {
    db.collection('pizza-collection').get().then(querySnapshot => {
      querySnapshot.forEach((doc) => {
      setList(pizzaList => [...pizzaList, doc.data()]);
      });
    });
  }, [])

  useEffect(() => {
    db.collection('pizza-collection').get().then(querySnapshot => {
      querySnapshot.forEach((doc) => {
      setDate(dateArr => [...dateArr, doc.data().added.toDate()]);
      });
    });
  }, [])

  const ratingDetails = val => {
    setComment(val.comment);
    setPizza(val.name);
  };

  const generateList = () => {
    pizzaList.sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating));
    return pizzaList.map((pizza, index) => {
      return (
        <>
        <h5>Created: </h5>
        <hr/>
        </>
      )
    });
  };

  return (
    <>
      <NavBar />
      <h3>Recently Added Pizzas</h3>
      <br />
      <div>{generateList()}</div>
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
