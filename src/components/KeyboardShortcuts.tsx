import React from "react";
import { Table } from "react-bootstrap";
import { MAX_TODO_HISTORY } from "../shared/constants";

export function KeyboardShortcuts() {
  return (
    <div>
      <h4>Keyboard Shortcuts</h4>
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
            <td>Open 'New Todo' form, or focus 'name' input on form</td>
          </tr>
          <tr>
            <td>⌘Z</td>
            <td>While 'New Todo' form is closed</td>
            <td>Undo (maximum history {MAX_TODO_HISTORY})</td>
          </tr>
          <tr>
            <td>⌘⇧Z</td>
            <td>While 'New Todo' form is closed</td>
            <td>Redo</td>
          </tr>
          <tr>
            <td>Esc</td>
            <td>While 'New Todo' form is open</td>
            <td>Close 'New Todo' form</td>
          </tr>
          <tr>
            <td>Tab</td>
            <td>While 'New Todo' field is focused</td>
            <td>Move to next field OR add new link</td>
          </tr>
          <tr>
            <td>Enter</td>
            <td>While 'New Todo' field is focused</td>
            <td>Submit current todo to 'today'</td>
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
        </tbody>
      </Table>
    </div>
  );
}
