import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useAppContext } from "../../context/context";

export function RestoreBackupModal() {
  const dispatch = useDispatch();
  const { setActiveModal, addToast } = useAppContext();
  const handleClose = () => setActiveModal("");
  const [file, setFile] = useState<Blob>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeFile = (e: any) => {
    setFile(e.target.files[0]);
  };

  const processFile = () => {
    const reader = new FileReader();
    reader.onload = function (event) {
      if (typeof event?.target?.result === "string") {
        try {
          dispatch({
            type: "RESTORE_FROM_BACKUP",
            payload: JSON.parse(event?.target?.result),
          });
          handleClose();
          addToast("Restored from backup successfully");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          addToast(`Error restoring from backup: ${err?.message}`);
        }
      }
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  return (
    <Modal show={true} onHide={handleClose} dialogClassName="wide-modal">
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Restore From Backup</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group controlId="formFileLg" className="mb-3">
            <Form.Control
              type="file"
              size="lg"
              accept=".json"
              onChange={onChangeFile}
            />
          </Form.Group>
          {file && (
            <div>
              <Alert variant="danger">
                Warning. This will overwrite your undo/redo history. This cannot
                be undone.
              </Alert>
              <Button variant="danger" onClick={processFile}>
                Process File
              </Button>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal>
  );
}
