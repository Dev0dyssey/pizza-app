import React, { useState } from "react";
import "../../StyleSheets/modal.scss";
import app from "../../base";
import { db } from "../../base";
import { calculateAverage } from "../../Helpers/calculateAverage";

const DetailsModal = (props) => {
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
    db.collection(databaseName)
      .doc(props.name)
      .collection("comments")
      .add({ comment: addedComment, userID: app.auth().currentUser.uid })
      .catch((error) => `Something went wrong: ${error}`);
    db.collection(databaseName)
      .doc(props.name)
      .update({
        rating: calculateAverage(avgRating),
        ratings: [...props.avgRating, addedRating],
        averageRatings: calculateAverage(avgRating),
      });
    setComment("");
    console.log(addedComment);
  };

  const deleteComment = (name, comment) => {
    let deleteRef = db
      .collection(databaseName)
      .doc(name)
      .collection(`comments`);
    deleteRef
      .where("comment", "==", comment)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          deleteRef.doc(doc.id).delete();
        });
      })
      .catch((err) => {
        console.log(`Error deleting comments ${err}`);
      });
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
                <div className="form-check form-check-inline ms-2">
                <label className="form-check-label" for="inlineRadio1">
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
                  if (comment.userID === app.auth().currentUser.uid) {
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
