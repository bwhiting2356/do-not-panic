import React from "react";
import { ToastContainer } from "react-bootstrap";
import { useAppContext } from "../context/context";
import { EventToast } from "./EventToast";

export function EventToastContainer() {
  const { toasts } = useAppContext();
  return (
    <div className="container" style={{ position: "absolute", top: "20px" }}>
      <ToastContainer position="top-end">
        {toasts.map(({ text, id }) => (
          <EventToast key={id} text={text} />
        ))}
      </ToastContainer>
    </div>
  );
}
