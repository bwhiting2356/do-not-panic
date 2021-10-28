import React, { useState } from "react";
import { ButtonGroup, Form } from "react-bootstrap";
import { padUrlWithHttp } from "../shared/util";
import { DeleteIconButton } from "./icon-buttons/DeleteIconButton";
import { EditIconButton } from "./icon-buttons/EditIconButton";

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

  if (!editing) {
    return (
      <div className="editable-item">
        <div className="content">
          <a target="_blank" rel="noreferrer" href={url}>
            {url}
          </a>
        </div>
        <ButtonGroup className="button-group">
          <EditIconButton onClick={() => setEditing((editing) => !editing)} />
          <DeleteIconButton onClick={onDeleteLink} />
        </ButtonGroup>
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
