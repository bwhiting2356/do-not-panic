import React, { useState } from "react";
import { Toast as ToastRB } from "react-bootstrap";
import logo from "../images/favicon.png";

type Props = {
  text: string;
};

export function EventToast({ text }: Props) {
  const [show, setShow] = useState(true);
  return (
    <ToastRB
      bg="light"
      onClose={() => setShow(false)}
      show={show}
      delay={2000}
      autohide
    >
      <ToastRB.Header>
        <img
          src={logo}
          className="rounded me-2"
          alt=""
          style={{ width: "20px" }}
        />

        <strong className="me-auto">{text}</strong>
      </ToastRB.Header>
    </ToastRB>
  );
}
