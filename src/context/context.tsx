import { createContext, useContext, useState } from "react";
import { AnyAction, Dispatch } from "redux";
import { v4 as uuidv4 } from "uuid";
import {
  undo,
  redo,
  archiveAllCompletedTodos,
  resortTodos,
  addTodoFromTemplate,
  editTodo,
  deleteTodo,
} from "../features/todos/todoSlice";
import { Due } from "../shared/due.type";

import { ID } from "../shared/id.type";
import { Todo } from "../shared/todo.interface";

interface ToastData {
  id: ID;
  text: string;
}

export interface AppContextInterface {
  editingTodoId: ID;
  selectedTodoId: ID;
  setEditingTodoId: (id: ID) => void;
  setSelectedTodoId: (id: ID) => void;
  showNewTodo: boolean;
  setShowNewTodo: (show: boolean) => void;
  toasts: ToastData[];
  addToast: (newToast: ToastData) => void;
}

const AppCtx = createContext<AppContextInterface>({
  editingTodoId: "",
  selectedTodoId: "",
  setEditingTodoId: () => {},
  setSelectedTodoId: () => {},
  showNewTodo: false,
  setShowNewTodo: () => {},
  toasts: [],
  addToast: () => {},
});

export const useAppContextState = (): AppContextInterface => {
  const [editingTodoId, setEditingTodoId] = useState("");
  const [selectedTodoId, setSelectedTodoId] = useState("");
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (newToast: ToastData) => {
    setToasts((prev) => [...prev, newToast]);
  };

  return {
    editingTodoId,
    setEditingTodoId,
    selectedTodoId,
    setSelectedTodoId,
    showNewTodo,
    setShowNewTodo,
    toasts,
    addToast,
  };
};

export const useAppContext = () => useContext(AppCtx);

export const composeReduxActionsWithContextToast = (
  dispatch: Dispatch<AnyAction>,
  addToast: (newToast: ToastData) => void
) => {
  const undoWithToast = () => {
    dispatch(undo());
    addToast({ text: "Undo", id: uuidv4() });
  };

  const redoWithToast = () => {
    dispatch(redo());
    addToast({ text: "Redo", id: uuidv4() });
  };

  const addTodoFromTemplateWithToast = (template: string) => {
    dispatch(addTodoFromTemplate(template));
    addToast({
      text: `New todo added with ${template} template`,
      id: uuidv4(),
    });
  };

  const sortTodosWithToast = () => {
    dispatch(resortTodos());
    addToast({ text: "Todos sorted", id: uuidv4() });
  };

  const onArchiveAllCompletedTodosWithToast = () => {
    dispatch(archiveAllCompletedTodos());
    addToast({ text: "All completed todos archived", id: uuidv4() });
  };

  const deleteTodoWithToast = (todo: Todo) => {
    dispatch(deleteTodo({ id: todo.id }));
    addToast({ text: `${todo.name} deleted`, id: uuidv4() });
  };

  const archiveTodoWithToast = (todo: Todo) => {
    dispatch(
      editTodo({
        id: todo.id,
        newTodo: {
          ...todo,
          due: Due.Archived,
          archivedDate: new Date(),
        },
      })
    );
    addToast({ text: `${todo.name} archived`, id: uuidv4() });
  }

  const moveTodoWithToast = (todo: Todo, newDue: Due) => {
    dispatch(
      editTodo({
        id: todo.id,
        newTodo: { ...todo, due: newDue },
      })
    );
    addToast({ text: `${todo.name} moved to ${newDue.toLowerCase()}`, id: uuidv4() });

  }

  return {
    undoWithToast,
    redoWithToast,
    addTodoFromTemplateWithToast,
    sortTodosWithToast,
    onArchiveAllCompletedTodosWithToast,
    deleteTodoWithToast,
    archiveTodoWithToast,
    moveTodoWithToast
  };
};

export default AppCtx;
