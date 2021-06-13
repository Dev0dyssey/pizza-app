import React, { useState, useEffect } from "react";
import NavBar from "../../UIComponents/NavBar";
import DetailsModal from "../Modals/DetailsModal";
import NewEntry from "../Modals/NewEntry";
import { db } from "../../base";

import "../../StyleSheets/main.css";

const OtherMeals = (props) => {
  const [comment, setComment] = useState("Placeholder Comment");
  const [mealName, setMeal] = useState("Placeholder Meal");
  const [mealList, setMeals] = useState([]);
  const [existingComments, getComments] = useState([]);
  const [owner, setOwner] = useState(null);
  const [avgRating, getRating] = useState([]);

  useEffect(() => {
    db.collection(`other-meals`)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setMeals((mealList) => [...mealList, doc.data()]);
        });
      });
  }, []);

  const ratingDetails = (val) => {
    existingComments.splice(0);
    getRating(val.ratings);
    setComment(val.comment);
    setMeal(val.name);
    setOwner(val.owner);
    db.collection("other-meals")
      .doc(val.name)
      .collection("comments")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getComments((existingComments) => [...existingComments, doc.data()]);
        });
      });
  };

  const generateList = () => {
    mealList.sort(
      (a, b) => parseFloat(b.averageRatings) - parseFloat(a.averageRatings)
    );
    return mealList.map((meal, index) => {
      return (
        <div className="col-lg-4 col-sm-12 d-flex" key={index}>
          <div className="card text-white" style={{ marginBottom: "1rem" }}>
            <img
              className="card-img-top"
              src={meal.imageUrl ? meal.imageUrl : meal.photo}
              alt={meal}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div className="card-img-overlay d-flex flex-column">
              <span className="badge rounded-pill bg-primary" style={{ width: "2rem" }}>
                {meal.averageRatings}
              </span>
              <br />
              <button
                onClick={() => ratingDetails(meal)}
                className="mainBTN mt-auto btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                {meal.name}
              </button>
              <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                role="dialog"
              >
                <DetailsModal
                  detailsOf="meal"
                  comment={comment}
                  name={mealName}
                  comments={existingComments}
                  owner={owner}
                  avgRating={avgRating}
                />
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
      <br />
      <div className="row">{generateList()}</div>
      <button
        className="btn btn-primary col-12 text-center"
        data-bs-toggle="modal"
        data-bs-target="#newPizza"
      >
        Add Meal!
      </button>
      <div className="modal fade" id="newPizza" tabIndex="-1" role="dialog">
        <NewEntry adding="meal" setList={setMeals} currentList={mealList} />
      </div>
    </>
  );
};

export default OtherMeals;
