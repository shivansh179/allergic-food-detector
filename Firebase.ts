import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyC-tdnlOOHNa8VXTsORZEMWmFsl5YyMYjY",
  authDomain: "food-ingredient-detector.firebaseapp.com",
  projectId: "food-ingredient-detector",
  storageBucket: "food-ingredient-detector.firebasestorage.app",
  messagingSenderId: "618486005029",
  appId: "1:618486005029:web:daa15d37e6b9527f50aecc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
