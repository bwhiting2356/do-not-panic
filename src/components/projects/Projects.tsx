import { ButtonGroup } from "react-bootstrap";
import React from "react";
import { ProjectTable } from "./ProjectTable";
import { useProjectsKeyboardShortcuts } from "./useProjectsKeyboardShortcuts";
import { useAppSelector } from "../../app/hooks";
import { useReduxActionsWithContext } from "../../context/context";
import {
  selectArchivedProjects,
  selectCurrentProjects,
} from "../../features/projects/selectors";
import { AddIconButton } from "../icon-buttons/AddIconButton";

function Projects() {
  const currentProjects = useAppSelector(selectCurrentProjects);
  const archivedProjects = useAppSelector(selectArchivedProjects);

  const { addNewProjectAndStartEditing } = useReduxActionsWithContext();

  useProjectsKeyboardShortcuts();

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h3 style={{ marginRight: "10px" }}>Current Projects</h3>
        <ButtonGroup>
          <AddIconButton onClick={addNewProjectAndStartEditing} />
        </ButtonGroup>
      </div>
      <ProjectTable projects={currentProjects} />
      <h3 style={{ marginRight: "10px" }}>Archived Projects</h3>
      <ProjectTable projects={archivedProjects} />
    </div>
  );
}

export default Projects;
