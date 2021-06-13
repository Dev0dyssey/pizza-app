import React, { useState, useRef } from "react";
import { db, storage } from "../../base";
import * as ml5 from "ml5";



const NewEntry = (props) => {

  const modelLoaded = () => {
    console.log('Model Loaded')
  }

  const classifier = ml5.imageClassifier('MobileNet', modelLoaded);

  const ref = useRef();
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

  const [file, setFile] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [previewImage, setPreview] = useState("");

  const clearData = () => {
    addDetails(emptyDetails);
    setPreview("");
    clearImage();
    console.log("Current Object: ", newDetails);
  };

  const clearImage = () => {
    ref.current.value = ""
    setFile(null);
  };

  const uploadImage = () => {
    const uploadTask = storage.ref(`images/${file.name}`).put(file);
    uploadTask.on("state_changed", console.log, console.error, () => {
      setUploaded(true);
      storage
        .ref("images")
        .child(file.name)
        .getDownloadURL()
        .then((imageUrl) => {
          setFile(null);
          setPreview(imageUrl);
          addDetails((newDetails) => {
            return { ...newDetails, imageUrl };
          });
        });
    });
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    setUploaded(false);
    if (props.adding === "pizza") {
      db.collection("pizza-collection")
        .doc(newDetails.name)
        .set(newDetails);
      props.setList([...props.currentList, newDetails]);
    } else {
      db.collection("other-meals")
        .doc(newDetails.name)
        .set(newDetails);
      props.setList([...props.currentList, newDetails]);
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
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
            </button>
          </div>
          <div className="modal-body">
            <p>Enter below Pizza information:</p>
            <div className="form" id="myForm">
              <div className="form-row">
                <div className="form-group col-md-12 mb-3">
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
                <div className="form-group col-md-12 mb-3">
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
              </div>
              <div className="form-row image-input">
                <div className="form-group col-md-6">
                  <label for="imageUploadContainer">Pizza Image</label>
                  <input
                    type="file"
                    className="form-control-file"
                    id="imageUploadContainer"
                    //Input file is always an uncontrolled component. Therefore we need to use the DOM ref (useRef()) to manually clear the component
                    //https://stackoverflow.com/questions/60986168/react-how-to-clear-file-input-and-data-input-fields-after-submitting-form
                    ref={ref}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  {
                    previewImage ? <img src={previewImage} alt="Preview" style={{ width: "100%", height: "100%" }}></img> : null
                  }
                </div>
              </div>
              <div
                className="form-group"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  className="btn btn-primary btn-sm me-1"
                  disabled={!file}
                  onClick={uploadImage}
                >
                  Confirm Image
                </button>
                {/* <button
                  className="btn btn-seconday btn-sm mr-1"
                >
                  Check Image
                </button> */}
                <button
                  className="btn btn-danger btn-sm ml-1"
                  disabled={!file}
                  onClick={clearImage}
                >
                  Clear Image
                </button>
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
            <div className="form-check form-check-inline ms-2">
              <label className="form-check-label" for="inlineRadio1">
                1
              </label>
              <input
                className="form-check-input"
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
              </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label" for="inlineRadio2">
                2
              </label>
              <input
                className="form-check-input"
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
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label" for="inlineRadio3">
                3
              </label>
              <input
                className="form-check-input"
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
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label" for="inlineRadio3">
                4
              </label>
              <input
                className="form-check-input"
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
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label" for="inlineRadio3">
                5
              </label>
              <input
                className="form-check-input"
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
              data-bs-dismiss="modal"
              onClick={() => clearData()}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              data-dismiss="modal"
              disabled={!newDetails.imageUrl}
            >
              Save changes
            </button>
          </div>
          {!uploaded && (
            <div className="alert alert-danger" role="alert">
              Please attach an image of your amazing meal!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewEntry;
