/* eslint-disable @typescript-eslint/no-explicit-any */
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import createMigrate from "redux-persist/es/createMigrate";
import { persistReducer, persistStore } from "redux-persist";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  Action,
  ThunkAction,
  combineReducers,
  createStore,
} from "@reduxjs/toolkit";
import todosReducer from "../features/todos/todoSlice";
import projectsReducer from "../features/projects/projectSlice";
import templatesReducer from "../features/templates/templateSlice";
import settingsReducer from "../features/settings/settingsSlice";
import { Template } from "../shared/template";
import { Project } from "../shared/project";
import { Link } from "../shared/link";

const migrations = {
  1: (state: any) => {
    if (!state.currentState.projects) {
      return {
        currentState: {
          ...state.currentState,
          domainName: state.currentState.projectName,
        },
        futureState: [],
        pastState: [],
      };
    }
    return state;
  },
  2: (state: any) => {
    if (!state.todos) {
      return { todos: state };
    }
    return state;
  },
  5: (state: any) => {
    if (!state.templates) {
      let noneProject = state.projects.currentState.projects.find(
        (project: Project) => project.title.toLowerCase() === "none"
      );

      let adminProject = state.projects.currentState.projects.find(
        (project: Project) => project.title.toLowerCase() === "admin"
      );

      let newProjects = state.projects.currentState.projects;

      if (!noneProject) {
        noneProject = new Project("None");
        newProjects = [...newProjects, noneProject];
      }
      if (!adminProject) {
        adminProject = new Project("Admin");
        newProjects = [...newProjects, adminProject];
      }

      return {
        ...state,
        projects: {
          currentState: {
            projects: newProjects,
          },
          futureState: [],
          pastState: [],
        },
        templates: {
          currentState: {
            templates: [
              new Template("Default", noneProject.id),
              new Template("Start Day", adminProject.id, "Start Day", "0.5", [
                new Link("http://go/pwaivers:daily"),
              ]),
              new Template("Start Week", adminProject.id, "Start Week", "1", [
                new Link("http://go/pwaivers:weekly"),
              ]),
            ],
          },
          futureState: [],
          pastState: [],
        },
      };
    }
  },
};

const persistConfig = {
  key: "root",
  migrate: createMigrate(migrations, { debug: false }),
  storage,
  version: 5,
};
const rootReducer = combineReducers({
  projects: projectsReducer,
  templates: templatesReducer,
  todos: todosReducer,
  settings: settingsReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, composeWithDevTools());

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
