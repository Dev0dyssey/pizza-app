import React, { useState, useEffect } from "react";
import NavBar from "../UIComponents/NavBar";
import { db } from "../base";

import "../StyleSheets/main.css";

const OtherMeals = props => {
  const [mealList, setMeals] = useState([]);

  useEffect(() => {
    db.collection(`other-meals`)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          setMeals(mealList => [...mealList, doc.data()]);
        });
      });
  }, []);

  const generateList = () => {
    return mealList.map((meal, index) => {
      return (
        <div className="col-md-4 col-sm-1 d-flex" key={index}>
          <div className="card text-white" style={{ marginBottom: "1rem" }}>
            <img
              className="card-img-top"
              src={meal.photo}
              alt={meal}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div className="card-img-overlay d-flex flex-column">
              <span className="badge badge-primary" style={{ width: "1rem" }}>
                5
              </span>
              <br />
              <button className="mainBTN mt-auto btn btn-primary">
                {meal.name}
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <NavBar />
      <h3>Other meal rating system!</h3>
      <div>{generateList()}</div>
    </>
  );
};

export default OtherMeals;
