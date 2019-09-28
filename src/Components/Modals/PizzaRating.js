import React from "react";

const PizzaRating = props => {
  return (
    <>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Rating details on {props.pizza}
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
            <p>{props.comment}</p>
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
          </div>
          
          
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button type="button" className="btn btn-primary" data-dismiss="modal">
              Save changes
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default PizzaRating;
