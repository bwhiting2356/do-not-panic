import React from "react";
import { Badge } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectDomainName } from "../features/todos/selectors";
import { setProjectName } from "../features/todos/todoSlice";
import { TextField } from "./TextField";

export function ProjectName() {
  const dispatch = useAppDispatch();
  const projectName = useAppSelector(selectDomainName);

  const onEditProjectName = (newName: string) =>
    dispatch(setProjectName(newName));

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <strong>Domain Name:</strong>
      <h3 style={{ marginLeft: "10px" }}>
        <Badge>
          <TextField text={projectName} onEditText={onEditProjectName} />
        </Badge>
      </h3>
    </div>
  );
}
