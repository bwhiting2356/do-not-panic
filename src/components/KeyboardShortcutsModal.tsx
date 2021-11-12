import React from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { MAX_TODO_HISTORY } from "../shared/constants";

const KeyboardShortcutsTable = () => (
  <div>
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Keys</th>
          <th>Context</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>⌘↵</td>
          <td>Anywhere</td>
          <td>Add new todo and start editing</td>
        </tr>
        <tr>
          <td>⌘Z</td>
          <td>Anywhere</td>
          <td>Undo (maximum history {MAX_TODO_HISTORY})</td>
        </tr>
        <tr>
          <td>⌘⇧Z</td>
          <td>Anywhere</td>
          <td>Redo</td>
        </tr>
        <tr>
          <td>Esc</td>
          <td>Anywhere</td>
          <td>Unselect todo row if any</td>
        </tr>
        <tr>
          <td>⌘⇧1</td>
          <td>Anywhere</td>
          <td>Add new todo with 'start day' template</td>
        </tr>
        <tr>
          <td>⌘⇧2</td>
          <td>Anywhere</td>
          <td>Add new todo with 'start week' template</td>
        </tr>
        <tr>
          <td>⇧?</td>
          <td>Anywhere</td>
          <td>Show/Hide keyboard shortcuts</td>
        </tr>
        <tr>
          <td>m</td>
          <td>While todo row is selected</td>
          <td>Move to today/later</td>
        </tr>
        <tr>
          <td>a</td>
          <td>While todo row is selected</td>
          <td>Archive todo</td>
        </tr>
        <tr>
          <td>d</td>
          <td>While todo row is selected</td>
          <td>Delete todo</td>
        </tr>
        <tr>
          <td>e</td>
          <td>While todo row is selected</td>
          <td>Edit todo</td>
        </tr>
        <tr>
          <td>↓</td>
          <td>While todo row is selected</td>
          <td>Select row below</td>
        </tr>
        <tr>
          <td>↑</td>
          <td>While todo row is selected</td>
          <td>Select row above</td>
        </tr>
        <tr>
          <td>↵</td>
          <td>While todo row is selected</td>
          <td>Open first link in new tab</td>
        </tr>
        <tr>
          <td>Space</td>
          <td>While todo row is selected</td>
          <td>Toggle todo done</td>
        </tr>
        <tr>
          <td>s</td>
          <td>While no row is editing</td>
          <td>Sort todos</td>
        </tr>
        <tr>
          <td>v</td>
          <td>While no row is editing</td>
          <td>Archive all completed todos</td>
        </tr>
      </tbody>
    </Table>
  </div>
);

interface Props {
  show: boolean;
  handleClose: () => void;
}

export function KeyboardShortcutsModal({ show, handleClose }: Props) {
  return (
    <Modal show={show} onHide={handleClose} dialogClassName="wide-modal">
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Keyboard Shortcuts</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <KeyboardShortcutsTable />
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
