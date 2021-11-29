import { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";

interface Props {
  toggleText: string;
  size?: "sm" | "lg" | undefined;
  show: boolean;
  setShow: (show: boolean) => void;
}

export const HoverDropdown: React.FC<Props> = ({
  toggleText,
  children,
  size,
  show,
  setShow,
}) => {
  return (
    <Dropdown
      show={show}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Dropdown.Toggle
        variant="outline-primary"
        id="dropdown-basic"
        size={size}
      >
        {toggleText}
      </Dropdown.Toggle>
      <div className="smooth-mouse-menu"></div>
      <Dropdown.Menu>{children}</Dropdown.Menu>
    </Dropdown>
  );
};
