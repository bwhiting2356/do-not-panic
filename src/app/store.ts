import { ThunkAction, Action, createStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createMigrate from "redux-persist/es/createMigrate";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import todosReducer from "../features/todos/todoSlice";
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
};

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  migrate: createMigrate(migrations, { debug: false }),
};
const persistedReducer = persistReducer(persistConfig, todosReducer);

export const store = createStore(persistedReducer);

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
