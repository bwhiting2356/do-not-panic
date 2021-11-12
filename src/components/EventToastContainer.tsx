import React from "react";
import { ToastContainer } from "react-bootstrap";
import { useAppContext } from "../context/context";
import { EventToast } from "./EventToast";

export function EventToastContainer() {
  const { toasts } = useAppContext();
  return (
    <div className="container toast-container-wrapper">
      <ToastContainer position="bottom-end">
        {toasts.map(({ text, id }) => (
          <EventToast key={id} text={text} />
        ))}
      </ToastContainer>
    </div>
  );
}
