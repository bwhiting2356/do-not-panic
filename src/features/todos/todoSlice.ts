import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ID } from '../../shared/id.type';
import { templateGenerators, Todo, TodoTemplates } from "../../shared/todo";
import { sortTodos } from '../../shared/util';
import { Due } from '../../shared/due.type';
import { addNewStateGoingForward, redo, undo, StateWithHistory } from '../shared';

interface TodoState {
    todos: Todo[];
    domainName: string;
}

export interface TodoStateWithHistory extends StateWithHistory<TodoState> {};

const initialCurrentState: TodoState = {
    todos: [],
    domainName: 'work',
}

const initialState: TodoStateWithHistory = {
    pastState: [],
    currentState: initialCurrentState,
    futureState: []
}

export const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        setProjectName: (state, action: PayloadAction<string>) => {
            return addNewStateGoingForward(
                state, {
                ...state.currentState,
                domainName: action.payload,
            })
        },
        resortTodos: (state) => {
            const sortedTodos = state.currentState.todos.slice().sort(sortTodos);
            return addNewStateGoingForward(
                state, {
                ...state.currentState,
                todos: sortedTodos,
            })
        },
        addNewTodo: (state, action: PayloadAction<Todo>) => {
            const newTodos = [
                { ...action.payload },
                ...state.currentState.todos,
            ];
            return addNewStateGoingForward(
                state, {
                ...state.currentState,
                todos: newTodos,
            }
            );
        },
        addTodoFromTemplate: (state, action: PayloadAction<TodoTemplates>) => {
            const newTodos = [
                templateGenerators[action.payload](),
                ...state.currentState.todos,
            ];
            return addNewStateGoingForward(
                state, {
                ...state.currentState,
                todos: newTodos,
            }
            );
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
            
            return addNewStateGoingForward(state, { ...state.currentState, todos: newTodos });
        },
        deleteTodo: (state, action: PayloadAction<{ id: ID }>) => {
            const newTodos = state.currentState.todos.filter(todo => todo.id !== action.payload.id);
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
        undoTodos: undo,
        redoTodos: redo
    }
})

export const { setProjectName, resortTodos, editTodo, deleteTodo, addNewTodo, addTodoFromTemplate, archiveAllCompletedTodos, undoTodos, redoTodos } = todoSlice.actions;

export default todoSlice.reducer;