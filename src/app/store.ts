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
import timerReducer from "../features/timer/timerSlice";

import { initialSettingsState } from "../features/settings/settingsSlice";

const migrations = {
  6: (state: any) => {
    if (!state.settings.pomodoroWorkTime) {
      return {
        ...state,
        settings: {
          currentState: {
            phoneNumber: state.settings.currentState.phoneNumber,
            pomodoroWorkTime:
              initialSettingsState.currentState.pomodoroWorkTime,
            pomodoroBreakTime:
              initialSettingsState.currentState.pomodoroBreakTime,
          },
        },
      };
    }
    return state;
  },
};

const persistConfig = {
  key: "root",
  migrate: createMigrate(migrations, { debug: false }),
  storage,
  version: 6,
};
const rootReducer = combineReducers({
  projects: projectsReducer,
  templates: templatesReducer,
  todos: todosReducer,
  settings: settingsReducer,
  timer: timerReducer,
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
