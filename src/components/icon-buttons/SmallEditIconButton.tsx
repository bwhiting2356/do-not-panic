import React from "react";
import { Pencil } from "react-bootstrap-icons";

interface Props {
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}
export function SmallEditIconButton(props: Props) {
  return (
    <button className="small-invisible-button" {...props}>
      <Pencil />
    </button>
  );
}
