import React, { useState } from "react";
import { Form } from "react-bootstrap";

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

  const onTextChange = (newText: string) => setNewText(newText);

  if (!editing) {
    return (
      <div onClick={() => setEditing(true)} className="editable-item">
        <div className="content">{text}</div>
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
