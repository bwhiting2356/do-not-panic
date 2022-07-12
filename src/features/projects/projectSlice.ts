import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  StateWithHistory,
  addNewStateGoingForward,
  redo,
  undo,
} from "../shared";
import { Project } from "../../shared/project";
import { ID } from "../../shared/id.type";

interface ProjectState {
  projects: Project[];
}

export type ProjectStateWithHistory = StateWithHistory<ProjectState>;

const initialCurrentState: ProjectState = {
  projects: [],
};

const initialState: ProjectStateWithHistory = {
  currentState: initialCurrentState,
  futureState: [],
  pastState: [],
};

export const projectSlice = createSlice({
  initialState,
  name: "projects",
  reducers: {
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
    editAllProjects: (state, action: PayloadAction<Project[]>) => {
      return addNewStateGoingForward(state, {
        ...state.currentState,
        projects: action.payload,
      });
    },
    redoProjects: redo,
    undoProjects: undo,
  },
});

export const {
  editProject,
  editAllProjects,
  undoProjects,
  redoProjects,
  addNewProject,
  deleteProject,
} = projectSlice.actions;

export default projectSlice.reducer;
