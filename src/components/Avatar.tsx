import React from "react";
import { Image } from "react-bootstrap";
import { Person } from "react-bootstrap-icons";
import { useAppContext } from "../context/context";
import { useFirebaseContext } from "../firebase/FirebaseAuthProvider";

export function Avatar() {
  const { user } = useFirebaseContext();
  const photoURL = user?.photoURL;
  const { setShowAuth } = useAppContext();

  const image = photoURL ? (
    <Image roundedCircle src={photoURL} style={{ width: "30px" }} />
  ) : (
    <Person size={30} />
  );

  return (
    <button
      className="small-invisible-button"
      style={{ width: "50px" }}
      onClick={() => setShowAuth(true)}
    >
      <div style={{ width: "50px", marginRight: "20px" }}>{image}</div>
    </button>
  );
}
