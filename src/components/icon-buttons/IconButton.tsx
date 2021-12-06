import React from "react";
import { Button } from "react-bootstrap";
import { Icon as RBIcon } from "react-bootstrap-icons";

type Props = {
  onClick?: () => void;
  tabIndex?: number;
  Icon: RBIcon;
  variant: string;
  text?: string;
  className?: string;
};
export function IconButton({
  onClick,
  tabIndex,
  Icon,
  variant,
  text,
  className,
}: Props) {
  return (
    <Button
      className={className}
      tabIndex={tabIndex}
      onClick={onClick}
      variant={variant}
      size={text ? undefined : "sm"}
    >
      <Icon style={text ? { marginRight: "10px" } : {}} />
      {text}
    </Button>
  );
}
