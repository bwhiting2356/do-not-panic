import { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";

interface Props {
  toggleText: string;
  size?: "sm" | "lg" | undefined;
  show?: boolean;
}

export const HoverDropdown: React.FC<Props> = ({
  toggleText,
  children,
  size,
  show = false,
}) => {
  const [showDropdown, setShowDropdown] = useState(show);
  useEffect(() => {
    setShowDropdown(show);
  }, [show, setShowDropdown]);

  return (
    <Dropdown
      show={showDropdown}
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
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
