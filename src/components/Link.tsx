import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { padUrlWithHttp } from "../shared/util";

interface Props {
  url: string;
  onEditLink: (url: string) => void;
  onDeleteLink: () => void;
}
export function Link({ url, onEditLink, onDeleteLink }: Props) {
  const [editing, setEditing] = useState(false);
  const [newUrl, setNewUrl] = useState(url);

  const onUrlChange = (e: any) => {
    setNewUrl(e.target.value);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    setEditing(false);
    onEditLink(padUrlWithHttp(newUrl));
  };

  const toggleSetEditing = (e: any) => {
    if (!e.target.classList.contains("url")) {
      setEditing((editing) => !editing);
    }
  };

  if (!editing) {
    return (
      <div className="editable-item" style={{ height: "100%" }}>
        <div className="content" onClick={toggleSetEditing}>
          <a className="url" target="_blank" rel="noreferrer" href={url}>
            {url}
          </a>
        </div>
      </div>
    );
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Control
        type="text"
        value={newUrl}
        onChange={onUrlChange}
        onBlur={onSubmit}
      />
    </Form>
  );
}
