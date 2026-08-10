import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import NavBar from "../../UIComponents/NavBar";
import DetailsModal from "../Modals/DetailsModal";
import NewEntry from "../Modals/NewEntry";
import { db } from "../../base";

import "../../StyleSheets/main.css";

const MainPage = (props) => {
  const [comment, setComment] = useState("Placeholder Comment");
  const [pizzaName, setPizza] = useState("Placeholder Pizza");
  const [pizzaList, setList] = useState([]);
  const [existingComments, getComments] = useState([]);
  const [owner, setOwner] = useState(null);
  const [avgRating, getRating] = useState([]);
  const oneDay = 24 * 60 * 60;
  const now = Math.floor(Date.now() / 1000);

  useEffect(() => {
    getDocs(collection(db, "pizza-collection"))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setList((pizzaList) => [...pizzaList, doc.data()]);
      });
    });
  }, []);

  const ratingDetails = (val) => {
    const { ratings, comment, name, owner } = val;
    getRating(ratings);
    setComment(comment);
    setPizza(name);
    setOwner(owner);
    const snapRef = collection(db, "pizza-collection", name, "comments");
    getDocs(snapRef).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        getComments((existingComments) => [...existingComments, doc.data()]);
      })
    });
  };

  const generateList = () => {
    pizzaList.sort(
      (a, b) => parseFloat(b.added.seconds) - parseFloat(a.added.seconds)
    );
    return pizzaList
      .filter((pizza) => now - pizza.added.seconds < oneDay)
      .map((pizza, index) => {
        return (
          <div className="col-md-4 col-sm-1 d-flex" key={index}>
            <div className="card text-white" style={{ marginBottom: "1rem" }}>
              <img
                className="card-img-top"
                src={pizza.photo}
                alt={pizza}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div className="card-img-overlay d-flex flex-column">
                <span className="badge rounded-pill bg-primary" style={{ width: "2rem" }}>
                  {pizza.rating}
                </span>
                <br />
                <button
                  onClick={() => ratingDetails(pizza)}
                  className="mainBTN mt-auto btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  {pizza.name}
                </button>
                <div
                  className="modal fade"
                  id="exampleModal"
                  tabIndex="-1"
                  role="dialog"
                >
                  <DetailsModal
                    comment={comment}
                    name={pizzaName}
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
      <h3>Recently Added Pizzas (Last 24 hours)</h3>
      <br />
      <div className="row">{generateList()}</div>
      <button
        className="btn btn-primary col text-center"
        data-bs-toggle="modal"
        data-bs-target="#newPizza"
      >
        Add Pizza!
      </button>
      <div className="modal fade" id="newPizza" tabIndex="-1" role="dialog">
        <NewEntry />
      </div>
    </>
  );
};

export default MainPage;
