import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ID } from '../../shared/id.type';
import { Todo } from "../../shared/todo.interface";

export interface TodoState {
    todos: Todo[],
};

const initialState: TodoState = {
    todos: [],
}

export const todoSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<{ todo: Todo }>) => {
            return { ...state, todos: [...state.todos, action.payload.todo] };
        },
        editTodo: (state, action: PayloadAction<{ id: ID, newTodo: Todo }>) => {
            const { todos } = state;
            const { id, newTodo } = action.payload;
            const newTodos = todos.slice().map(todo => {
                if (todo.id === id) {
                    return { ...todo, ...newTodo }
                } else {
                    return todo;
                }
            })
            console.log(newTodos);
            return { ...state, todos: newTodos };
        },
        deleteTodo: (state, action: PayloadAction<{ id: ID }>) => {
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload.id)
            }

        },
    }
})

export const { editTodo, deleteTodo, addTodo } = todoSlice.actions;

export const selectTodosDueToday = (state: RootState) => state.todos.todos.filter(
    todo => todo.due === 'today'
);

export const selectTodosDueLater = (state: RootState) => state.todos.todos.filter(
    todo => todo.due === 'later'
);

export default todoSlice.reducer;