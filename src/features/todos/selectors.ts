import { createSelector } from 'reselect'
import { RootState } from '../../app/store';
import { Due } from '../../shared/due.type';

const selectTodos = (state: RootState) => state.todos?.todos;

export const selectTodosDueToday = createSelector(
    selectTodos,
    todos => todos.filter(todo => todo.due === Due.Today)
)

export const selectTodosDueLater = createSelector(
    selectTodos,
    todos => todos.filter(todo => todo.due === Due.Later)
)