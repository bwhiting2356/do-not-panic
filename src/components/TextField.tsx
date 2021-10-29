import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { prettifyPoms } from "../shared/util";

interface Props {
  text: string;
  onEditText: (newText: string) => void;
}

export function TextField({ text, onEditText }: Props) {
  const [editing, setEditing] = useState(false);
  const [newText, setNewText] = useState(text);

  const onSubmit = (e: any) => {
    e.preventDefault();
    setEditing(false);
    onEditText(newText);
  };

  const setEditingTrue = () => {
    console.log("clicked");
    setEditing(true);
  };

  const onTextChange = (newText: string) => setNewText(newText);

  if (!editing) {
    return (
      <div onClick={setEditingTrue} className="editable-item">
        <div className="content">{prettifyPoms(text) || <p>&nbsp;</p>}</div>
      </div>
    );
  }
  return (
    <Form onSubmit={onSubmit}>
      <Form.Control
        autoFocus
        type="text"
        value={newText}
        onChange={(e) => onTextChange(e.target.value)}
        onBlur={onSubmit}
      />
    </Form>
  );
}
