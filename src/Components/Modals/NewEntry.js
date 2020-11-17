import React, { useState } from "react";
import { db } from "../../base";

const NewEntry = (props) => {
  const emptyDetails = {
    owner: db.app.auth().currentUser.displayName,
    name: "",
    photo: "",
    restaurant: "",
    rating: "",
    ratings: [],
    comment: "",
    added: new Date(Date.now()),
  };

  // New pizza object{} that gets passed to the database to create new entries
  const [newDetails, addDetails] = useState({
    owner: db.app.auth().currentUser.displayName,
    name: "",
    photo: "",
    restaurant: "",
    rating: "",
    ratings: [],
    comment: "",
    added: new Date(Date.now()),
  });

  const clearData = () => {
    addDetails(emptyDetails);
    console.log("Current Object: ", newDetails);
  };

  const handleSubmit = () => {
    if (props.adding === "pizza") {
      db.collection("pizza-collection")
        .doc(newDetails.name)
        .set(newDetails);
      props.setTest([...props.currentList, newDetails]);
    } else {
      db.collection("other-meals")
        .doc(newDetails.name)
        .set(newDetails);
    }

    clearData();
  };

  return (
    <>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              New Pizza!
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
            <p>Enter below Pizza information:</p>
            <div className="form" id="myForm">
              <div className="form-row">
                <div className="form-group col-md-6">
                  <input
                    type="text"
                    className="form-control mr-1"
                    placeholder="Pizza Name"
                    value={newDetails.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      addDetails((newDetails) => {
                        return { ...newDetails, name };
                      });
                    }}
                  />
                </div>
                <div className="form-group col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Restaurant"
                    value={newDetails.restaurant}
                    onChange={(e) => {
                      const restaurant = e.target.value;
                      addDetails((newDetails) => {
                        return { ...newDetails, restaurant };
                      });
                    }}
                  />
                </div>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Photo"
                    value={newDetails.photo}
                    onChange={(e) => {
                      const photo = e.target.value;
                      addDetails((newDetails) => {
                        return { ...newDetails, photo };
                      });
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label for="pizzaComment">Comment(s)</label>
                <textarea
                  className="form-control"
                  rows="5"
                  id="pizzaComment"
                  style={{ resize: "none" }}
                  value={newDetails.comment}
                  onChange={(e) => {
                    const comment = e.target.value;
                    addDetails((newDetails) => {
                      return { ...newDetails, comment };
                    });
                  }}
                />
              </div>
            </div>
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
                onClick={() =>
                  addDetails((newDetails) => {
                    return { ...newDetails, rating: 1 };
                  })
                }
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
                onClick={() =>
                  addDetails((newDetails) => {
                    return { ...newDetails, rating: 2 };
                  })
                }
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
                onClick={() =>
                  addDetails((newDetails) => {
                    return { ...newDetails, rating: 3 };
                  })
                }
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
                onClick={() =>
                  addDetails((newDetails) => {
                    return { ...newDetails, rating: 4 };
                  })
                }
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
                onClick={() =>
                  addDetails((newDetails) => {
                    return { ...newDetails, rating: 5 };
                  })
                }
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
              onClick={handleSubmit}
              data-dismiss="modal"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewEntry;
