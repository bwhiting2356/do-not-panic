import React from "react";
import { ButtonGroup } from "react-bootstrap";
import { PieChart } from "react-bootstrap-icons";
import { useAppSelector } from "../../app/hooks";
import {
  useAppContext,
  useReduxActionsWithContext,
} from "../../context/context";
import {
  selectArchivedProjects,
  selectCurrentProjects,
} from "../../features/projects/selectors";
import { ArchiveToggleButton } from "../ArchiveToggleButton";
import { AddIconButton } from "../icon-buttons/AddIconButton";
import { IconButton } from "../icon-buttons/IconButton";
import { ProjectTable } from "./ProjectTable";
import { useProjectsKeyboardShortcuts } from "./useProjectsKeyboardShortcuts";

function Projects() {
  const currentProjects = useAppSelector(selectCurrentProjects);
  const archivedProjects = useAppSelector(selectArchivedProjects);
  const { showArchive, setShowProjectAnalytics } = useAppContext();

  const { addNewProjectAndStartEditing } = useReduxActionsWithContext();

  useProjectsKeyboardShortcuts();

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h3 style={{ marginRight: "10px" }}>Current Projects</h3>
        <ButtonGroup>
          <AddIconButton onClick={addNewProjectAndStartEditing} />
          <IconButton
            onClick={() => setShowProjectAnalytics(true)}
            variant="outline-primary"
            Icon={PieChart}
          />
        </ButtonGroup>
      </div>
      <ProjectTable projects={currentProjects} />
      <ArchiveToggleButton />
      {showArchive && <ProjectTable projects={archivedProjects} />}
    </div>
  );
}

export default Projects;
