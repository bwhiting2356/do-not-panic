import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import config from "./config";

const Firebase = firebase.initializeApp(config);

export const Providers = {
  google: new firebase.auth.GoogleAuthProvider().setCustomParameters({
    prompt: 'select_account'
 }),
};

export const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
export default Firebase;
