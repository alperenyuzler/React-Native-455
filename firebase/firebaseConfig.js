import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwgv10x4uVtmqh4VfcsNV490wiri3oL-I",
  authDomain: "rn-455-19f14.firebaseapp.com",
  projectId: "rn-455-19f14",
  storageBucket: "rn-455-19f14.firebasestorage.app",
  messagingSenderId: "712013829690",
  appId: "1:712013829690:web:b93893860cc397262dc703",
  measurementId: "G-9D76KNGF9S"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);