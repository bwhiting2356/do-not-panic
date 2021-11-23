import { createSelector } from "reselect";
import { RootState } from "../../app/store";

const selectProjectState = (state: RootState) => state.projects;

export const selectProjects = createSelector(
    selectProjectState,
    state => state.currentState.projects
)