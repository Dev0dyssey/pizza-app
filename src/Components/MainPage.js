import React, { useState, useEffect } from "react";
import NavBar from "../UIComponents/NavBar";
import DetailsModal from "./Modals/DetailsModal";
import NewEntry from "./Modals/NewEntry";
import { db } from "../base";

import "../StyleSheets/main.css";

const MainPage = (props) => {
  const [comment, setComment] = useState("Placeholder Comment");
  const [pizzaName, setPizza] = useState("Placeholder Pizza");
  const [pizzaList, setList] = useState([]);
  const [existingComments, getComments] = useState([]);
  const [owner, setOwner] = useState(null);
  const [avgRating, getRating] = useState([]);

  useEffect(() => {
    db.collection("pizza-collection")
      .get()
      .then((querySnapshot) => {
        console.log("SNAPSHOT QUERY");
        querySnapshot.forEach((doc) => {
          setList((pizzaList) => [...pizzaList, doc.data()]);
        });
      });
  }, []);

  const ratingDetails = (val) => {
    existingComments.splice(0);
    const { ratings, comment, name, owner } = val;
    getRating(ratings);
    setComment(comment);
    setPizza(name);
    setOwner(owner);
    // Get existing comments from the collection
    // Pass the comment state as a prop to the modal render
    db.collection("pizza-collection")
      .doc(name)
      .collection("comments")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getComments((existingComments) => [...existingComments, doc.data()]);
        });
      });
  };

  const generateList = () => {
    pizzaList.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    return pizzaList.map((pizza, index) => {
      return (
        <div className="col-md-4 col-sm-1 d-flex" key={index}>
          <div className="card text-white" style={{ marginBottom: "1rem" }}>
            <img
              className="card-img-top"
              // Handling previous version of storing images. When all images changed to Firestore storage, remove ternary expression
              src={pizza.imageUrl ? pizza.imageUrl : pizza.photo}
              alt={pizza}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div className="card-img-overlay d-flex flex-column">
              <span className="badge badge-primary" style={{ width: "1rem" }}>
                {Math.round(pizza.rating)}
              </span>
              <br />
              <button
                onClick={() => ratingDetails(pizza)}
                className="mainBTN mt-auto btn btn-primary"
                data-toggle="modal"
                data-target="#exampleModal"
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
                  detailsOf="pizza"
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
      <div className="row">{generateList()}</div>
      <button
        className="btn btn-primary col text-center"
        data-toggle="modal"
        data-target="#newPizza"
      >
        Add Pizza!
      </button>
      <div className="modal fade" id="newPizza" tabIndex="-1" role="dialog">
        <NewEntry adding="pizza" setTest={setList} currentList={pizzaList} />
      </div>
    </>
  );
};

export default MainPage;
