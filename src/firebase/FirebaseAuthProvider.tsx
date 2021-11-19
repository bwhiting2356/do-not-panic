import React, { useState, useContext, createContext, useEffect } from "react";
import "firebase/compat/auth";
import { signInWithPopup } from "firebase/auth";
import { auth, Providers } from "./firebase";
import { useAppContext } from "../context/context";

interface FirebaseContextInterface {
  logInWithGoogle: () => void;
  logOut: () => void;
  user: firebase.default.User | null;
}
const FirebaseCtx = createContext<FirebaseContextInterface>({
  logInWithGoogle: () => {},
  logOut: () => {},
  user: null,
});

export const useFirebaseContext = () => useContext(FirebaseCtx);

export const FirebaseAuthProvider: React.FC = ({ children }) => {
  const { setShowAuth } = useAppContext();
  const [user, setUser] = useState<firebase.default.User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => setUser(user));
  });

  const logInWithGoogle = () => {
    signInWithPopup(auth, Providers.google)
      .then(() => {
        setShowAuth(false);
      })
      .catch((err) => console.log("error", err));
  };
  
  const logOut = () => {
    auth
      .signOut()
      .then(() => {
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
