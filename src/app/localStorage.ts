import { Todo } from "../shared/todo.interface";
import { generateNewTodo } from "../shared/util";
import { RootState } from "./store";

const handleMigration = (state: any) => {
    // console.log('state.todos.pastTodos', state.todos.pastTodos);
    // if (state.todos.pastTodos) {
    const newShape = {
        todos: {
            pastState: state.todos.pastTodos.map((todoList: Todo[]) => {
                return {
                    todos: todoList,
                    newTodo: generateNewTodo(),
                };
            }),
            currentState: {
                todos: state.todos,
                newTodo: generateNewTodo(),
            },
            futureState: state.todos.futureTodos.map((todoList: Todo[]) => {
                return {
                    todos: todoList,
                    newTodo: generateNewTodo(),
                };
            }),
        }
    }
    console.log('newShape', newShape);
    return newShape;
};

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem("state");
        if (serializedState === null) {
            return undefined;
        }
        return handleMigration(JSON.parse(serializedState));
    } catch (err) {
        console.log('Im here')
        return undefined;
    }
};

export const saveState = (state: RootState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("state", serializedState);
    } catch (err) {
        // ignore write errors
    }
};
