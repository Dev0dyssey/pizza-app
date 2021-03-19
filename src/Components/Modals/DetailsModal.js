import React, { useState } from "react";
import "../../StyleSheets/modal.css";
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
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <h4>Added by: {owner}</h4>
            <p>Click to order from store!</p>
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
            <div className="form-check form-check-inline ml-2 mb-3">
              <label className="form-check-label mr-1" for="inlineRadio1">
                1
              </label>
              <input
                className="form-check-input mr-3"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio1"
                value="option1"
                onClick={() => addRating(1)}
              />
              <label className="form-check-label mr-1" for="inlineRadio2">
                2
              </label>
              <input
                className="form-check-input mr-3"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio2"
                value="option2"
                onClick={() => addRating(2)}
              />
              <label className="form-check-label mr-1" for="inlineRadio3">
                3
              </label>
              <input
                className="form-check-input mr-3"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio3"
                value="option3"
                onClick={() => addRating(3)}
              />
              <label className="form-check-label mr-1" for="inlineRadio3">
                4
              </label>
              <input
                className="form-check-input mr-3"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio3"
                value="option3"
                onClick={() => addRating(4)}
              />

              <label className="form-check-label mr-1" for="inlineRadio3">
                5
              </label>
              <input
                className="form-check-input mr-3"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio3"
                value="option3"
                onClick={() => addRating(5)}
              />
            </div>
            <div>
              <h5>Comments: </h5>
              {/* Render out the list of existing comments coming in from the "comments" prop */}
              <ul>
                {comments.map((comment, index) => {
                  if (comment.userID === app.auth().currentUser.uid) {
                    return (
                      <li key={index}>
                        {comment.comment}
                        <i
                          className="ml-1 far fa-trash-alt deleteBtn"
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
              data-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-dismiss="modal"
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
