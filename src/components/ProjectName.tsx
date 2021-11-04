import React from "react";
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
    <span>
      <TextField text={projectName} onEditText={onEditProjectName} />
    </span>
  );
}
