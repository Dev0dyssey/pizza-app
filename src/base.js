import * as firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

const app = firebase.initializeApp( {
    apiKey: "AIzaSyC3oNTsQIVZRO94jt7-1uzXQUo2C-tELio",
    authDomain: "vrate-7a0cd.firebaseapp.com",
    databaseURL: "https://vrate-7a0cd.firebaseio.com",
    projectId: "vrate-7a0cd",
    storageBucket: "vrate-7a0cd.appspot.com",
    messagingSenderId: "667991130799",
    appId: "1:667991130799:web:47f5a6eff1ecd3e5a10a5a",
    measurementId: "G-3Z0P83DTF2"
  });

  // Changing state persistence
  // Clears user login information once session is terminated
  // Need to login with every new session
  app.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    return console.log("I am working")
  })
  .catch(function(error) {
    // Handle Errors here.
    console.log(error);
  });

  const db = app.firestore();

  db.collection('pizza-data').add({
    pizza: "Spicy hot double pepperoni 7",
    origin: "Pizza palace",
    comment: "Some delicious pizza!",
    rating: "5",
    pizza_image: "https://bit.ly/2mtvjbu"
  }).then(() => {
    console.log("DATA CREATED!");
  }).catch((error) => {
    console.log(`Something went wrong ${error}`)
  });

  export { db }
  export default app;