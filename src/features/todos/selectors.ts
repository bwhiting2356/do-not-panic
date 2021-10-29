import { createSelector } from 'reselect'
import { RootState } from '../../app/store';
import { Due } from '../../shared/due.type';

const selectCurrentState = (state: RootState) => state.currentState;
const selectTodos = createSelector(
    selectCurrentState,
    currentState => currentState.todos
)

export const selectTodosDueToday = createSelector(
    selectTodos,
    todos => todos.filter(todo => todo.due === Due.Today)
)

export const selectTodosDueLater = createSelector(
    selectTodos,
    todos => todos.filter(todo => todo.due === Due.Later)
)

export const selectArchivedTodos = createSelector(
    selectTodos,
    todos => todos.filter(todo => todo.due === Due.Archived)
)

export const selectNewTodo = createSelector(
    selectCurrentState,
    (currentState) => currentState.newTodo,
)