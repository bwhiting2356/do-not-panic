import React from "react";
import { Lightning } from "react-bootstrap-icons";
import { IconButton } from "./IconButton";

type Props = {
  onClick?: (e?: React.MouseEvent) => void;
  tabIndex?: number;
  variant: string;
};
export function StartIconButton(props: Props) {
  return <IconButton {...props} Icon={Lightning} />;
}
