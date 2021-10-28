import React from "react";
import { Button, Modal } from "react-bootstrap";

interface Props {
  show: boolean;
  heading: string;
  body: string;
  handleClose: () => void;
  handleConfirm: () => void;
}

export function WarningModal({
  show,
  heading,
  body,
  handleClose,
  handleConfirm,
}: Props) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
