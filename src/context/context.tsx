import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch } from "../app/hooks";
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
  showArchive: boolean;
  setShowArchive: (show: boolean) => void;
  showKeyboardShortcuts: boolean;
  setShowKeyboardShortcuts: (show: boolean) => void;
  toasts: ToastData[];
  addToast: (newToast: string) => void;
}

const AppCtx = createContext<AppContextInterface>({
  editingTodoId: "",
  selectedTodoId: "",
  setEditingTodoId: () => {},
  setSelectedTodoId: () => {},
  showNewTodo: false,
  setShowNewTodo: () => {},
  showArchive: false,
  setShowArchive: () => {},
  showKeyboardShortcuts: false,
  setShowKeyboardShortcuts: () => {},
  toasts: [],
  addToast: () => {},
});

export const useAppContextState = (): AppContextInterface => {
  const [editingTodoId, setEditingTodoId] = useState("");
  const [selectedTodoId, setSelectedTodoId] = useState("");
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (text: string) => {
    setToasts((prev) => [...prev, { id: uuidv4(), text }]);
  };

  return {
    editingTodoId,
    setEditingTodoId,
    selectedTodoId,
    setSelectedTodoId,
    showNewTodo,
    setShowNewTodo,
    showArchive,
    setShowArchive,
    showKeyboardShortcuts,
    setShowKeyboardShortcuts,
    toasts,
    addToast,
  };
};

export const useAppContext = () => useContext(AppCtx);

export const AppCtxProvider: React.FC = ({ children }) => {
  const context = useAppContextState();
  return <AppCtx.Provider value={context}>{children}</AppCtx.Provider>;
};

export const useReduxActionsWithContextToast = () => {
  const { addToast, setSelectedTodoId } = useAppContext();
  const dispatch = useAppDispatch();
  const undoWithToast = () => {
    dispatch(undo());
    addToast("undo");
  };

  const redoWithToast = () => {
    dispatch(redo());
    addToast("redo");
  };

  const addTodoFromTemplateWithToast = (template: string) => {
    dispatch(addTodoFromTemplate(template));
    addToast(`New todo added with ${template} template`);
  };

  const sortTodosWithToast = () => {
    dispatch(resortTodos());
    addToast("Todos sorted");
  };

  const onArchiveAllCompletedTodosWithToast = () => {
    dispatch(archiveAllCompletedTodos());
    addToast("All completed todos archived");
  };

  const deleteTodoWithToast = (todo: Todo) => {
    dispatch(deleteTodo({ id: todo.id }));
    addToast(`${todo.name} deleted`);
    setSelectedTodoId("");
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
    addToast(`${todo.name} archived`);
    setSelectedTodoId("");
  };

  const moveTodoWithToast = (todo: Todo, newDue: Due) => {
    dispatch(
      editTodo({
        id: todo.id,
        newTodo: { ...todo, due: newDue },
      })
    );
    addToast(`${todo.name} moved to ${newDue.toLowerCase()}`);
  };

  return {
    undoWithToast,
    redoWithToast,
    addTodoFromTemplateWithToast,
    sortTodosWithToast,
    onArchiveAllCompletedTodosWithToast,
    deleteTodoWithToast,
    archiveTodoWithToast,
    moveTodoWithToast,
  };
};

export default AppCtx;
