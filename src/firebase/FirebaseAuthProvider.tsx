import React, { useState, useContext, createContext } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { auth, Providers } from "./firebase";
import { useAppContext } from "../context/context";

interface FirebaseContextInterface {
  logInWithGoogle: () => void;
  logOut: () => void;
  user: firebase.auth.UserCredential | undefined;
}
const FirebaseCtx = createContext<FirebaseContextInterface>({
  logInWithGoogle: () => {},
  logOut: () => {},
  user: undefined,
});

export const useFirebaseContext = () => useContext(FirebaseCtx);

export const FirebaseAuthProvider: React.FC = ({ children }) => {
  const { setShowAuth } = useAppContext();
  const [user, setUser] = useState<firebase.auth.UserCredential>();
  console.log("user in provider")
  console.log(user);

  const logInWithGoogle = () => {
    auth
      .signInWithPopup(Providers.google)
      .then((user) => {
        setUser(user);
        setShowAuth(false);
      })
      .catch((err) => console.log("error", err));
  };
  const logOut = () => {
    auth
      .signOut()
      .then(() => {
        setUser(undefined);
        setShowAuth(false);
      })
      .catch((err) => console.log("error", err));
  };
  const context = {
    logInWithGoogle,
    logOut,
    user,
  };

  return (
    <FirebaseCtx.Provider value={context}>{children}</FirebaseCtx.Provider>
  );
};

export default FirebaseCtx;
