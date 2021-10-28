import React from "react";
import { Table } from "react-bootstrap";

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
            <td>⌘↵ (Command Enter) </td>
            <td>Anywhere</td>
            <td>Open 'New Todo' form</td>
          </tr>
          <tr>
            <td>Esc</td>
            <td>While 'New Todo' form is open</td>
            <td>Close 'New Todo' form</td>
          </tr>
          <tr>
            <td>Tab</td>
            <td>While 'New Todo' form is open</td>
            <td>Move to next field OR add new link</td>
          </tr>
          <tr>
            <td>Enter</td>
            <td>While 'New Todo' form is open</td>
            <td>Submit current todo to 'today'</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
