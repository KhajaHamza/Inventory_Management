// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA638HnRytHBykKlyICDpVte7mavUIAqvA",
  authDomain: "inventory-management-3bd10.firebaseapp.com",
  projectId: "inventory-management-3bd10",
  storageBucket: "inventory-management-3bd10.appspot.com",
  messagingSenderId: "594208199144",
  appId: "1:594208199144:web:cae73cc6fc7eb0160c145d",
  measurementId: "G-WTJ8FMEMKR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore};