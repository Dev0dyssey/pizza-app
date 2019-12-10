import React, { useState } from "react";
import "../../StyleSheets/modal.css";
import { db } from "../../base";

const DetailsModal = props => {
  // Destructure values out of the props object
  const {name, owner, comment, comments, avgRating} = props
  // New comments state
  const [addedComment, setComment] = useState([]);

  const handleSubmit = () => {
    db.collection(`pizza-collection`)
      .doc(props.name)
      .collection("comments")
      .add({ comment: addedComment })
      .catch(error => `Something went wrong: ${error}`);
  };

  const deleteComment = (name, comment) => {
    let deleteRef = db.collection(`pizza-collection`).doc(name).collection(`comments`)
    deleteRef.where('comment', '==', comment).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          deleteRef.doc(doc.id).delete()
        })
      })
      .catch(err => {
        console.log(`Error deleting comments ${err}`)
      })
  }

  return (
    <>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Rating details on {name} with {avgRating.reduce((a, b) => a + b, 0)/avgRating.length} average rating
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <h4>Added by: {owner}</h4>
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
              />
            </div>
            <div>
              <h5>Comments: </h5>
              {/* Render out the list of existing comments coming in from the "comments" prop */}
              <ul>
              {comments.map((comment, index) => {
                return (
                  <li key={index}>
                    {comment.comment}
                    <i 
                      className="ml-1 far fa-trash-alt deleteBtn"
                      data-dismiss="modal"
                      onClick={() => deleteComment(name, comment.comment)}></i>  
                  </li>                 
                  );
              })}
              </ul>
            </div>
            <div className="input-group">
              <textarea
                className="form-control"
                placeholder="Comments"
                onChange={e => {
                  const newComment = e.target.value;
                  setComment(newComment);
                }}
              ></textarea>
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
              onClick={() => handleSubmit()}
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
