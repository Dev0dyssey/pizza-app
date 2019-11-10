import React, { useState } from "react";
import { db } from "../../base";

const NewPizza = props => {
  // New pizza object{} that gets passed to the database to create new entries
  const [newPizza, addPizza] = useState({
    name: "",
    photo: "",
    restaurant: "",
    rating: "",
    comment: "",
    added: new Date(Date.now())
  });


  const handleSubmit = () => {
    db.collection("pizza-collection")
      .add(newPizza)
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
            <div className="form">
              <div className="form-row">
                <div className="form-group col-md-6">
                  <input
                    type="text"
                    className="form-control mr-1"
                    placeholder="Pizza Name"
                    onChange={e => {
                      const name = e.target.value;
                      addPizza(newPizza => {
                        return { ...newPizza, name };
                      });
                    }}
                  ></input>
                </div>
                <div className="form-group col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Restaurant"
                    onChange={e => {
                      const restaurant = e.target.value;
                      addPizza(newPizza => {
                        return { ...newPizza, restaurant };
                      });
                    }}
                  ></input>
                </div>
                <div className="input-group mb-3">
                  {/* <div className="custom-file">
                    <input type="file" className="form-control-file" id="inputGroup" aria-describedby="inputGroupAddon" onChange={handleChange}/>
                  </div> */}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Photo"
                    onChange={e => {
                      const photo = e.target.value;
                      addPizza(newPizza => {
                        return { ...newPizza, photo };
                      });
                    }}
                  ></input>
                </div>
              </div>
              <div className="form-group">
                <label for="pizzaComment">Comment(s)</label>
                <textarea
                  className="form-control"
                  rows="5"
                  id="pizzaComment"
                  style={{ resize: "none" }}
                  onChange={e => {
                    const comment = e.target.value;
                    addPizza(newPizza => {
                      return { ...newPizza, comment };
                    });
                  }}
                ></textarea>
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
                  addPizza(newPizza => {
                    return { ...newPizza, rating: 1 };
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
                  addPizza(newPizza => {
                    return { ...newPizza, rating: 2 };
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
                  addPizza(newPizza => {
                    return { ...newPizza, rating: 3 };
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
                  addPizza(newPizza => {
                    return { ...newPizza, rating: 4 };
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
                  addPizza(newPizza => {
                    return { ...newPizza, rating: 5 };
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
              onClick={() => handleSubmit()}
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

export default NewPizza;
