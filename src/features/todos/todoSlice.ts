import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ID } from '../../shared/id.type';
import { MAX_TODO_HISTORY } from '../../shared/constants';
import { Todo } from "../../shared/todo.interface";
import { generateNewTodo, sortTodos } from '../../shared/util';
import { Due } from '../../shared/due.type';

interface TodoState {
    todos: Todo[],
    newTodo: Todo
}

export interface TodoStateWithHistory {
    pastState: TodoState[],
    currentState: TodoState,
    futureState: TodoState[]
};

const initialCurrentState = {
    todos: [],
    newTodo: generateNewTodo(),
}

const initialState: TodoStateWithHistory = {
    pastState: [],
    currentState: initialCurrentState,
    futureState: []
}


const addNewStateGoingForward = (prevState: TodoStateWithHistory, newState: TodoState): TodoStateWithHistory => {
    const newPastState = [
        ...prevState.pastState || [],
        prevState.currentState
    ].slice(MAX_TODO_HISTORY * -1);
    return {
        pastState: newPastState,
        currentState: newState,
        futureState: []
    }
}

export const todoSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<{ todo: Todo }>) => {
            const newTodos = [...state.currentState.todos, action.payload.todo];
            newTodos.sort(sortTodos);
            return addNewStateGoingForward(state, { ...state.currentState, todos: newTodos });
        },
        editTodo: (state, action: PayloadAction<{ id: ID, newTodo: Todo }>) => {
            const { todos } = state.currentState;
            const { id, newTodo } = action.payload;
            const newTodos = todos.slice().map(todo => {
                if (todo.id === id) {
                    return { ...todo, ...newTodo }
                } else {
                    return todo;
                }
            })
            newTodos.sort(sortTodos);
            return addNewStateGoingForward(state, { ...state.currentState, todos: newTodos });
        },
        deleteTodo: (state, action: PayloadAction<{ id: ID }>) => {
            const newTodos = state.currentState.todos.filter(todo => todo.id !== action.payload.id);
            newTodos.sort(sortTodos);
            return addNewStateGoingForward(state, { ...state.currentState, todos: newTodos });
        },
        archiveAllCompletedTodos: (state) => {
            const newTodos = state.currentState.todos.map(todo => {
                if (todo.due !== Due.Archived && todo.done) {
                    return { ...todo, due: Due.Archived, archivedDate: new Date() };
                }
                return todo;
            })
            return addNewStateGoingForward(state, { ...state.currentState, todos: newTodos });
        },
        undo: (state) => {
            const { pastState, currentState, futureState } = state;
            const prevState = pastState[pastState.length - 1];
            const newPastState = pastState.slice(0, pastState.length - 1);

            if (prevState) {
                return {
                    pastState: newPastState,
                    currentState: prevState,
                    futureState: [currentState, ...futureState]
                }
            } else {
                return {
                    pastState,
                    currentState,
                    futureState
                }
            }
        },
        redo: (state: TodoStateWithHistory) => {
            const { pastState, currentState, futureState } = state;
            const nextState = futureState[0] || currentState;
            const newFutureState = futureState.slice(1) || [];
            return {
                pastState: [...pastState, currentState],
                currentState: nextState,
                futureState: newFutureState
            }
        }
    }
})

export const { editTodo, deleteTodo, addTodo, archiveAllCompletedTodos, undo, redo } = todoSlice.actions;

export default todoSlice.reducer;