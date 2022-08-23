import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, doc, addDoc, updateDoc, arrayUnion, arrayRemove, getDocs, deleteDoc } from "firebase/firestore";
import "../../StyleSheets/modal.scss";
import app from "../../base";
import { db } from "../../base";
import { calculateAverage } from "../../Helpers/calculateAverage";

const DetailsModal = (props) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  // Destructure values out of the props object
  const { name, owner, comment, comments, avgRating } = props;
  // New comments state
  const [addedComment, setComment] = useState("");
  // Ratings state to be used in adding more ratings in order to calculate average rating
  const [addedRating, addRating] = useState(0);
  const ratingsArray = [1, 2, 3, 4, 5];

  const databaseName =
    props.detailsOf === `pizza` ? `pizza-collection` : `other-meals`;

  const handleSubmit = () => {
    const collectionRef = collection(db, databaseName, name, "comments");
    addDoc(collectionRef, { comment: addedComment, userID: currentUser.uid }).then(() => {
      console.log("Comment added");
    });

    const ratingsRef = doc(db, databaseName, props.name);
    updateDoc(ratingsRef, {
      rating: calculateAverage(avgRating),
      ratings: [...props.avgRating, addedRating], //arrayUnion() cannot be used as it adds unique values, and we want all ratings even if there are several instance of the same rating
      averageRatings: calculateAverage(avgRating),
    })

    setComment("");
    console.log(addedComment);
  };

  const deleteComment = (name, comment) => {
    const collectionRef = collection(db, databaseName, name, "comments");
    getDocs(collectionRef).then((querySnapshot) => {
      querySnapshot.forEach(doc => {
        deleteDoc(doc.ref);
      })
    }).then(console.log("Comment Deleted!"))
  };

  return (
    <>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Rating details on {name}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
            </button>
          </div>
          <div className="modal-body">
            <h4>Added by: {owner}</h4>
            {/* ADD CONTAINER FLUID WHEN WE NEED TO USE CSS GRID */}
              <div className="row order-link">
                <div className="col mb-3">
                  <span>Click to order!</span>
                  <i className="link-button fas fa-shopping-cart ms-2"></i>
                </div>
              </div>
            <h5>
              Average Rating:
              {isNaN(avgRating)
                ? ` ${Math.round(
                    (avgRating.reduce((a, b) => a + b, 0) / avgRating.length) *
                      100
                  ) / 100} `
                : ` No Ratings yet `}
            </h5>
            <p>{comment}</p>
            <br />
            Rating:
            {ratingsArray.map((value, index) => {
              return (
                <div className="form-check form-check-inline ms-2" key={index}>
                <label className="form-check-label" htmlFor="inlineRadio1">
                  { value }
                </label>
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio1"
                  value="Option"
                  onClick={() => addRating(value)}
                />
                </div>
              )
            })}
            <div className="mt-3">
              <h5>Comments: </h5>
              {/* Render out the list of existing comments coming in from the "comments" prop */}
              <ul>
                {comments.map((comment, index) => {
                  if (comment.userID === currentUser.uid) {
                    return (
                      <li key={index}>
                        {comment.comment}
                        <i
                          className="ms-1 far fa-trash-alt deleteBtn"
                          data-dismiss="modal"
                          onClick={() => deleteComment(name, comment.comment)}
                        />
                      </li>
                    );
                  } else {
                    return <li key={index}>{comment.comment}</li>;
                  }
                })}
              </ul>
            </div>
            <div className="input-group">
              <textarea
                className="form-control"
                placeholder="Comments"
                value={addedComment}
                onChange={(e) => {
                  const newComment = e.target.value;
                  setComment(newComment);
                }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={handleSubmit}
              disabled={addedComment !== "" ? false : true}
            >
              Add Rating & Comment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsModal;
