import React, { ElementType } from "react";
import { Form } from "react-bootstrap";
import { prettifyPoms } from "../shared/util";

type Props = {
  text: string;
  editing: boolean;
  onEditText: (newText: string) => void;
  onSubmit: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type?: ElementType<any>;
  placeholder?: string;
  className?: string;
};

export function TextField({
  text,
  editing,
  onEditText,
  onSubmit,
  onBlur,
  autoFocus = false,
  type,
  placeholder = "",
  className,
}: Props) {
  const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
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

  if (type) {
    return (
      <Form onSubmit={submit}>
        <Form.Control
          bsPrefix={`form-control ${className || ""}`}
          autoFocus={autoFocus}
          as={type}
          value={text}
          onChange={(e) => onEditText(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
        />
      </Form>
    );
  }
  return (
    <Form onSubmit={submit}>
      <Form.Control
        bsPrefix={`form-control ${className}`}
        autoFocus={autoFocus}
        value={text}
        onChange={(e) => onEditText(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
      />
    </Form>
  );
}
