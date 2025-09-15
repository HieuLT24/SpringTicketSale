import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyAEPXoot14WlElsEb50_5l991Yd9PhzPu4",
  authDomain: "ticketsale-e0ab7.firebaseapp.com",
  projectId: "ticketsale-e0ab7",
  storageBucket: "ticketsale-e0ab7.firebasestorage.app",
  messagingSenderId: "116275128653",
  appId: "1:116275128653:web:db64fa781ad6cde2c56f04",
  measurementId: "G-JE66CP35D5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
