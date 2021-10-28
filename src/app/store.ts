import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import todosReducer from "../features/todos/todoSlice";
import { loadState, saveState } from "./localStorage";

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
