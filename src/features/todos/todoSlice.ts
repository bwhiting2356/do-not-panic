import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ID } from "../../shared/id.type";
import { Todo } from "../../shared/todo";
import { sortTodos } from "../../shared/util";
import { Due } from "../../shared/due.type";
import {
  StateWithHistory,
  addNewStateGoingForward,
  redo,
  undo,
} from "../shared";

interface TodoState {
  todos: Todo[];
  domainName: string;
}

export type TodoStateWithHistory = StateWithHistory<TodoState>;

const initialCurrentState: TodoState = {
  domainName: "work",
  todos: [],
};

const initialState: TodoStateWithHistory = {
  currentState: initialCurrentState,
  futureState: [],
  pastState: [],
};

export const todoSlice = createSlice({
  initialState,
  name: "todos",
  reducers: {
    addNewTodo: (state, action: PayloadAction<Todo>) => {
      const newTodos = [{ ...action.payload }, ...state.currentState.todos];
      return addNewStateGoingForward(state, {
        ...state.currentState,
        todos: newTodos,
      });
    },
    archiveAllCompletedTodos: (state) => {
      const newTodos = state.currentState.todos.map((todo) => {
        if (todo.due !== Due.Archived && todo.done) {
          return { ...todo, archivedDate: new Date(), due: Due.Archived };
        }
        return todo;
      });
      return addNewStateGoingForward(state, {
        ...state.currentState,
        todos: newTodos,
      });
    },
    deleteTodo: (state, action: PayloadAction<{ id: ID }>) => {
      const newTodos = state.currentState.todos.filter(
        (todo) => todo.id !== action.payload.id
      );
      return addNewStateGoingForward(state, {
        ...state.currentState,
        todos: newTodos,
      });
    },
    editTodo: (state, action: PayloadAction<{ id: ID; newTodo: Todo }>) => {
      const { todos } = state.currentState;
      const { id, newTodo } = action.payload;
      const newTodos = todos.slice().map((todo) => {
        if (todo.id === id) {
          return { ...todo, ...newTodo };
        } else {
          return todo;
        }
      });

      return addNewStateGoingForward(state, {
        ...state.currentState,
        todos: newTodos,
      });
    },
    redoTodos: redo,
    resortTodos: (state) => {
      const sortedTodos = state.currentState.todos.slice().sort(sortTodos);
      return addNewStateGoingForward(state, {
        ...state.currentState,
        todos: sortedTodos,
      });
    },
    setProjectName: (state, action: PayloadAction<string>) => {
      return addNewStateGoingForward(state, {
        ...state.currentState,
        domainName: action.payload,
      });
    },

    undoTodos: undo,
  },
});

export const {
  setProjectName,
  resortTodos,
  editTodo,
  deleteTodo,
  addNewTodo,
  archiveAllCompletedTodos,
  redoTodos,
  undoTodos,
} = todoSlice.actions;

export default todoSlice.reducer;
