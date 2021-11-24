import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addNewStateGoingForward,
  redo,
  undo,
  StateWithHistory,
} from "../shared";
import { Project } from "../../shared/project";
import { ID } from "../../shared/id.type";

interface ProjectState {
  projects: Project[];
}

export interface ProjectStateWithHistory
  extends StateWithHistory<ProjectState> {}

const initialCurrentState: ProjectState = {
  projects: [],
};

const initialState: ProjectStateWithHistory = {
  pastState: [],
  currentState: initialCurrentState,
  futureState: [],
};

export const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    editProject: (
      state,
      action: PayloadAction<{ id: ID; newProject: Project }>
    ) => {
      const { projects } = state.currentState;
      const { id, newProject } = action.payload;
      const newProjects = projects.slice().map((project) => {
        if (project.id === id) {
          return { ...project, ...newProject };
        } else {
          return project;
        }
      });

      return addNewStateGoingForward(state, {
        ...state.currentState,
        projects: newProjects,
      });
    },
    addNewProject: (state, action: PayloadAction<Project>) => {
      const newProjects = [
        { ...action.payload },
        ...state.currentState.projects,
      ];
      return addNewStateGoingForward(state, {
        ...state.currentState,
        projects: newProjects,
      });
    },
    deleteProject: (state, action: PayloadAction<{ id: ID }>) => {
      const newProjects = state.currentState.projects.filter(
        (project) => project.id !== action.payload.id
      );
      return addNewStateGoingForward(state, {
        ...state.currentState,
        projects: newProjects,
      });
    },
    undoProjects: undo,
    redoProjects: redo,
  },
});

export const {
  editProject,
  undoProjects,
  redoProjects,
  addNewProject,
  deleteProject,
} = projectSlice.actions;

export default projectSlice.reducer;
