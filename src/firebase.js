import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics";

export const config = {
  apiKey: "AIzaSyBOoixQxY1-c0bcWk-zLcgrso44TYayz_o",
  authDomain: "bazaario-1467c.firebaseapp.com",
  projectId: "bazaario-1467c",
  storageBucket: "bazaario-1467c.appspot.com",
  messagingSenderId: "411411004601",
  appId: "1:411411004601:web:7cabe5bcd45215b36aef68",
  measurementId: "G-MG70K03R70"
};

export const initFirebase = () => {
  const app = initializeApp(config);
  getAnalytics(app);
}