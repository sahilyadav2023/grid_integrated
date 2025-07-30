import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDl1B1Xo6PyddfRIUhiT0Gkl9iE7lqeysY",
  authDomain: "grid-98a8d.firebaseapp.com",
  projectId: "grid-98a8d",
  storageBucket: "grid-98a8d.firebasestorage.app",
  messagingSenderId: "131717744190",
  appId: "1:131717744190:web:63190f68a99a763bf4336f",
  measurementId: "G-82HYMG32FB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { auth };