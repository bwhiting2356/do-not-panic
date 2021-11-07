import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { padUrlWithHttp, truncateUrl } from "../shared/util";

type Props = {
  url: string;
  onEditLink: (url: string) => void;
  editing: boolean;
  onSubmit: () => void;
};

export function Link({ url, onEditLink, editing, onSubmit }: Props) {
  const [newUrl, setNewUrl] = useState(url);

  const onUrlChange = (e: any) => {
    setNewUrl(e.target.value);
  };

  const submit = (e: any) => {
    e.preventDefault();
    onEditLink(padUrlWithHttp(newUrl));
    onSubmit();
  };

  if (!editing) {
    return (
      <div className="editable-item" style={{ height: "100%" }}>
        <div className="content">
          <a className="url" target="_blank" rel="noreferrer" href={url}>
            {truncateUrl(url)}
          </a>
        </div>
      </div>
    );
  }

  return (
    <Form onSubmit={submit}>
      <Form.Control type="text" value={newUrl} onChange={onUrlChange} />
    </Form>
  );
}
