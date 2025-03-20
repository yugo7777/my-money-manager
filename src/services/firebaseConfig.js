// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMy3t9KUXxts0R9nQBmlxD0nOYbMe4mwM",
  authDomain: "my-money-manager-10c69.firebaseapp.com",
  projectId: "my-money-manager-10c69",
  storageBucket: "my-money-manager-10c69.firebasestorage.app",
  messagingSenderId: "185527584518",
  appId: "1:185527584518:web:fddaa5dd34f884dd61c087",
  measurementId: "G-05BVYTGHK8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);