import { Button, Container, Navbar } from "react-bootstrap";
import { signInWithGoogle } from "../firebase/firebase";

export function AuthPage() {
  const onSignIn = () => {
    signInWithGoogle();
  };

  return (
    <div style={{ height: "100vh" }}>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">To Do Ron Ron</Navbar.Brand>
        </Container>
      </Navbar>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100% - 56px)",
          width: "100vw",
          position: "relative",
        }}
      >
        <div className="background-overlay">
          <div className="background"></div>
        </div>

        <div style={{ position: "absolute", left: "70px" }}>
          <Button size="lg" onClick={onSignIn}>
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
