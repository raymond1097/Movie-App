import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_fOekZ56dsxbVj1ecS1iGGcmpdemB6O8",
  authDomain: "movie-app-c6664.firebaseapp.com",
  projectId: "movie-app-c6664",
  storageBucket: "movie-app-c6664.appspot.com",
  messagingSenderId: "792213417081",
  appId: "1:792213417081:web:53d46038a4b225fe90b8a8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
