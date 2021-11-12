import React from "react";
import { Form } from "react-bootstrap";
import { prettifyPoms } from "../shared/util";

type Props = {
  text: string;
  editing: boolean;
  onEditText: (newText: string) => void;
  onSubmit: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
};

export function TextField({
  text,
  editing,
  onEditText,
  onSubmit,
  onBlur,
  autoFocus = false,
}: Props) {
  const submit = (e: any) => {
    e.preventDefault();
    onSubmit();
  };

  if (!editing) {
    return (
      <div className="editable-item">
        <div className="content">{prettifyPoms(text) || <p>&nbsp;</p>}</div>
      </div>
    );
  }
  return (
    <Form onSubmit={submit}>
      <Form.Control
        autoFocus={autoFocus}
        type="text"
        value={text}
        onChange={(e) => onEditText(e.target.value)}
        onBlur={onBlur}
      />
    </Form>
  );
}
