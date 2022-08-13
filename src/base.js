import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC3oNTsQIVZRO94jt7-1uzXQUo2C-tELio",
  authDomain: "vrate-7a0cd.firebaseapp.com",
  databaseURL: "https://vrate-7a0cd.firebaseio.com",
  projectId: "vrate-7a0cd",
  storageBucket: "vrate-7a0cd.appspot.com",
  messagingSenderId: "667991130799",
  appId: "1:667991130799:web:47f5a6eff1ecd3e5a10a5a",
  measurementId: "G-3Z0P83DTF2",
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).then( () => {
  console.log("Persistence set")
});

const handleSignout = () => {
  signOut(auth).then(()  => {
    console.log("Sign Out successful");
  }).catch((error) => {
    console.log("Sign Out error: ", error)
  })
}

const db = getFirestore(app);
const storage = getStorage(app);
export { db, storage, handleSignout };
export default app;
