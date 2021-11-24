import React from "react";
import { Button } from "react-bootstrap";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import { useAppContext } from "../context/context";

export function ArchiveToggleButton() {
  const { showArchive, setShowArchive } = useAppContext();

  const toggleShowArchive = () => setShowArchive(!showArchive);

  return (
    <div style={{ display: "flex" }}>
      <div>
        <h3>Archive</h3>
      </div>
      <Button
        variant="light"
        onClick={toggleShowArchive}
        style={{ marginLeft: "10px", marginBottom: "10px" }}
      >
        {showArchive ? <ChevronUp /> : <ChevronDown />}
      </Button>
    </div>
  );
}
