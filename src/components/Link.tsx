import React, {
  ChangeEventHandler,
  FormEventHandler,
  MutableRefObject,
  useState,
} from "react";
import { Form } from "react-bootstrap";
import { cleanUrl, truncateUrl } from "../shared/util";

type Props = {
  url: string;
  onEditLink: (url: string) => void;
  editing: boolean;
  onSubmit: () => void;
  forwardRef?:
    | MutableRefObject<HTMLInputElement | null>
    | ((instance: HTMLInputElement | null) => void)
    | null;
};

export function Link({
  url,
  onEditLink,
  editing,
  onSubmit,
  forwardRef,
}: Props) {
  const [newUrl, setNewUrl] = useState(url);

  const onUrlChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNewUrl(e.target.value);
  };

  const submit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onEditLink(cleanUrl(newUrl));
    onSubmit();
  };

  const onBlur: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onEditLink(cleanUrl(newUrl));
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
    <Form onSubmit={submit} onBlur={onBlur}>
      <Form.Control
        type="text"
        value={newUrl}
        onChange={onUrlChange}
        ref={forwardRef}
      />
    </Form>
  );
}

export const LinkWithRef = React.forwardRef<HTMLInputElement, Props>(
  (props, ref) => <Link {...props} forwardRef={ref} />
);
