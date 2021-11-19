import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useAppContext } from "../../context/context";
import { useFirebaseContext } from "../../firebase/FirebaseAuthProvider";

export function AuthModal() {
    const { showAuth, setShowAuth } = useAppContext();
    const { user, logInWithGoogle, logOut } = useFirebaseContext();

    const button = user
    ? <Button variant="primary" onClick={logOut}>Log out</Button>
    : <Button variant="primary" onClick={logInWithGoogle}>Log in with Google</Button>

    const heading = user ? "Log out" : "Log in";

    return (
        <Modal
        show={showAuth}
        onHide={() => setShowAuth(!showAuth)}
        style={{ textAlign: "center" }}
        >
        <Modal.Header closeButton>
            <Modal.Title>{heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {button}       
        </Modal.Body>
        </Modal>
  );
}
