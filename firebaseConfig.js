import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; 

const firebaseConfig = {
  apiKey: "AIzaSyA3A4_1xSeiipFEktQllGfivbgks6SEfP8",
  authDomain: "testdb-24324.firebaseapp.com",
  databaseURL: "https://testdb-24324-default-rtdb.firebaseio.com",
  projectId: "testdb-24324",
  storageBucket: "testdb-24324.appspot.com",
  messagingSenderId: "155698916607",
  appId: "1:155698916607:web:936775506ec9182d1ab0ca",
  measurementId: "G-HZ2VVTW1TH",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const rtdb = getDatabase(app); 

export default app;
