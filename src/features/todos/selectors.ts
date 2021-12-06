import { createSelector } from "reselect";
import { RootState } from "../../app/store";
import { Due } from "../../shared/due.type";

const selectTodoState = (state: RootState) => state.todos;
const selectCurrentState = createSelector(
  selectTodoState,
  (state) => state.currentState
);
export const selectTodos = createSelector(
  selectCurrentState,
  (currentState) => currentState.todos
);

export const selectDomainName = createSelector(
  selectCurrentState,
  (currentState) => currentState.domainName
);

export const selectTodosDueToday = createSelector(selectTodos, (todos) =>
  todos.filter((todo) => todo.due === Due.Today)
);

export const selectTodosDueLater = createSelector(selectTodos, (todos) =>
  todos.filter((todo) => todo.due === Due.Later)
);

export const selectArchivedTodos = createSelector(selectTodos, (todos) =>
  todos.filter((todo) => todo.due === Due.Archived)
);

export const selectActiveTodoId = createSelector(
  selectCurrentState,
  (state) => state.activeTodoId
);

export const selectActiveTodo = createSelector(selectCurrentState, (state) =>
  state.todos.find((todo) => todo.id === state.activeTodoId)
);
