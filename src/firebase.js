// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFp8PWGDN0heJCg0VJxuVpsrvbIeASaXw",
  authDomain: "project-3---react-app.firebaseapp.com",
  databaseURL: "https://project-3---react-app-default-rtdb.firebaseio.com",
  projectId: "project-3---react-app",
  storageBucket: "project-3---react-app.appspot.com",
  messagingSenderId: "706940626968",
  appId: "1:706940626968:web:a421e5b16904791dae7b6d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app