import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectDomainName } from "../../features/todos/selectors";
import { setProjectName } from "../../features/todos/todoSlice";
import { TextField } from "../TextField";

export function ProjectName() {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const projectName = useAppSelector(selectDomainName);

  const onEditProjectName = (newName: string) =>
    dispatch(setProjectName(newName));

  return (
    <span onClick={() => setEditing(true)}>
      <TextField
        editing={editing}
        text={projectName}
        onEditText={onEditProjectName}
        onSubmit={() => setEditing(!editing)}
        onBlur={() => setEditing(!editing)}
      />
    </span>
  );
}
