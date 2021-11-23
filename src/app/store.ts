import {
  ThunkAction,
  Action,
  createStore,
  combineReducers,
} from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import createMigrate from "redux-persist/es/createMigrate";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import todosReducer from "../features/todos/todoSlice";
import projectsReducer from "../features/projects/projectSlice";
import { defaultProjects } from "../shared/defaultProjects";

const migrations = {
  1: (state: any) => {
    if (!state.currentState.projects) {
      return {
        currentState: {
          ...state.currentState,
          projects: defaultProjects,
          domainName: state.currentState.projectName,
        },
        pastState: [],
        futureState: [],
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
};

const persistConfig = {
  key: "root",
  storage,
  version: 2,
  migrate: createMigrate(migrations, { debug: false }),
};
const rootReducer = combineReducers({ 
  todos: todosReducer,
  projects: projectsReducer 
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
