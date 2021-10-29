import { createSelector } from 'reselect'
import { RootState } from '../../app/store';

const selectTodos = (state: RootState) => state.todos?.todos;

export const selectTodosDueToday = createSelector(
    selectTodos,
    todos => todos.filter(todo => todo.due === 'today')
)

export const selectTodosDueLater = createSelector(
    selectTodos,
    todos => todos.filter(todo => todo.due === 'later')
)