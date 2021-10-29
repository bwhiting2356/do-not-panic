import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ID } from '../../shared/id.type';
import { MAX_TODO_HISTORY } from '../../shared/constants';
import { Todo } from "../../shared/todo.interface";
import { sortTodos } from '../../shared/util';
import { Due } from '../../shared/due.type';

export interface TodoState {
    pastTodos: Todo[][],
    todos: Todo[],
    futureTodos: Todo[][]
};

const initialState: TodoState = {
    todos: [],
    pastTodos: [],
    futureTodos: []
}


const addNewStateGoingForward = (prevState: TodoState, newTodos: Todo[]): TodoState => {
    const newPastTodos = [
        ...prevState.pastTodos || [],
        prevState.todos
    ].slice(MAX_TODO_HISTORY * -1);
    return {
        pastTodos: newPastTodos,
        todos: newTodos,
        futureTodos: []
    }
}

export const todoSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<{ todo: Todo }>) => {
            const newTodos = [...state.todos, action.payload.todo];
            newTodos.sort(sortTodos);
            return addNewStateGoingForward(state, newTodos);
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
            newTodos.sort(sortTodos);
            return addNewStateGoingForward(state, newTodos);
        },
        deleteTodo: (state, action: PayloadAction<{ id: ID }>) => {
            const newTodos = state.todos.filter(todo => todo.id !== action.payload.id);
            newTodos.sort(sortTodos);
            return addNewStateGoingForward(state, newTodos);
        },
        archiveAllCompletedTodos: (state) => {
            const newTodos = state.todos.map(todo => {
                if (todo.due !== Due.Archived && todo.done) {
                    return { ...todo, due: Due.Archived, archivedDate: new Date() };
                }
                return todo;
            })
            return addNewStateGoingForward(state, newTodos);
        },
        undo: (state: TodoState) => {
            const { pastTodos, todos, futureTodos } = state;
            const prevTodos = pastTodos[pastTodos.length - 1];
            const newPastTodos = pastTodos.slice(0, pastTodos.length - 1);

            if (prevTodos) {
                return {
                    pastTodos: newPastTodos,
                    todos: prevTodos,
                    futureTodos: [todos, ...futureTodos]
                }
            } else {
                return {
                    pastTodos,
                    todos,
                    futureTodos
                }
            }

        },
        redo: (state: TodoState) => {
            const { pastTodos, todos, futureTodos } = state;
            const nextTodos = futureTodos[0] || todos;
            const newFutureTodos = futureTodos.slice(1) || [];
            return {
                pastTodos: [...pastTodos, todos],
                todos: nextTodos,
                futureTodos: newFutureTodos
            }
        }
    }
})

export const { editTodo, deleteTodo, addTodo, archiveAllCompletedTodos, undo, redo } = todoSlice.actions;

export default todoSlice.reducer;