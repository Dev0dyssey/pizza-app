import React, { useState } from "react";
import { Link } from 'react-router-dom';

const LogIn = ( props ) => {
  const pizzaUser = {
    tag: "",
    pizza: ""
  };
  const [user, setDetails] = useState(pizzaUser);

  return (
    <div className="jumbotron mt-5">
      <h1>An amazing pizza rating App!</h1>
      <form>
        <div className="form-group">
          <label for="examplePizza">Pizza user Handle</label>
          <input
            type="text"
            className="form-control"
            id="examplePizza"
            aria-describedby="pizzaHelp"
            placeholder="Enter Pizza user Tag"
            onChange={e => {
              const tag = e.target.value;
              setDetails(user => {
                return { ...user, tag };
              });
            }}
          />
          <small id="emailHelp" className="form-text text-muted">
            We MIGHT share your pizza user tag (*hint* Pineapples are evil).
          </small>
        </div>
        <div className="form-group">
          <label for="examplePizzaType">Best Pizza</label>
          <input
            type="text"
            className="form-control"
            id="examplePizzaType"
            placeholder="Pepperoni is good"
            onChange={e => {
              const pizza = e.target.value;
              setDetails(user => {
                return { ...user, pizza };
              });
            }}
          />
        </div>

        {/* <button className="btn btn-primary" onClick={() => setClick(true)}>
        Enter the App
        { click ? welcomeMsg() : "Nope" }
      </button> */}
      </form>
      <Link to={'/main'}>
      <button className="btn btn-primary" onClick={() => props.getUser(user)}>
        Enter
      </button>
      </Link>
    </div>
  );
};

export default LogIn;

// Sandbox
/*
    const [newPizza, setPizza] = useState("Mexican Pizza!")
    const specials = (val) => {
        return (val +1)
    }
    return (
        <div>
            <h5>More Pizza Awaits!</h5>
            <p>Starting off with {originalPizza}</p>
            <h2>Brand new addition: { newPizza }! Only with {specials(2)}</h2>
            <p>Or create your own! What will it be <input type="text" placeholder="Yum" onChange={e => setPizza(e.target.value)}></input></p>
        </div>
    )
    */
