import React from "react";
import { Trash } from "react-bootstrap-icons";
import { IconButton } from "./IconButton";

type Props = {
  onClick?: () => void;
  tabIndex?: number;
};

export function DeleteIconButton(props: Props) {
  return <IconButton variant="outline-danger" Icon={Trash} {...props} />;
}
