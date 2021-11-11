import React, { useState } from "react";
import { Toast } from "react-bootstrap";
import logo from "../images/favicon.png";

type Props = {
  text: string;
};
export function EventToast({ text }: Props) {
  const [show, setShow] = useState(true);
  return (
    <Toast
      bg="info"
      onClose={() => setShow(false)}
      show={show}
      delay={3000}
      autohide
    >
      <Toast.Header>
        <img
          src={logo}
          className="rounded me-2"
          alt=""
          style={{ width: "20px" }}
        />
        <strong className="me-auto">To Do</strong>
      </Toast.Header>
      <Toast.Body>{text}</Toast.Body>
    </Toast>
  );
}
