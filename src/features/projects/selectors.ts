import { createSelector } from "reselect";
import { RootState } from "../../app/store";

const selectProjectState = (state: RootState) => state.projects;

export const selectProjects = createSelector(
  selectProjectState,
  (state) => state.currentState.projects
);

export const selectCurrentProjects = createSelector(
  selectProjects,
  (projects) => projects.filter((project) => !project.archivedDate)
);

export const selectArchivedProjects = createSelector(
  selectProjects,
  (projects) => projects.filter((project) => Boolean(project.archivedDate))
);

export const selectProjectsFilteredInArchive = createSelector(
  [selectProjects],
  (projects) => {
    return projects
      .filter((project) => project.includeInArchiveFilter)
      .map((project) => project.id);
  }
);
