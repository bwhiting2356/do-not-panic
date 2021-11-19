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
  addNewTodo,
} from "../features/todos/todoSlice";
import { Due } from "../shared/due.type";

import { ID } from "../shared/id.type";
import { Todo, TodoTemplates } from "../shared/todo";

interface ToastData {
  id: ID;
  text: string;
}

export interface AppContextInterface {
  editingTodoId: ID;
  selectedTodoId: ID;
  setEditingTodoId: (id: ID) => void;
  setSelectedTodoId: (id: ID) => void;
  showArchive: boolean;
  setShowArchive: (show: boolean) => void;
  showProjectAnalytics: boolean;
  setShowProjectAnalytics: (show: boolean) => void;
  showEditProjects: boolean;
  setShowEditProjects: (show: boolean) => void;
  showKeyboardShortcuts: boolean;
  setShowKeyboardShortcuts: (show: boolean) => void;
  showAuth: boolean;
  setShowAuth: (show: boolean) => void;
  toasts: ToastData[];
  addToast: (newToast: string) => void;
}

const AppCtx = createContext<AppContextInterface>({
  editingTodoId: "",
  selectedTodoId: "",
  setEditingTodoId: () => {},
  setSelectedTodoId: () => {},
  showArchive: false,
  setShowArchive: () => {},
  showProjectAnalytics: false,
  setShowProjectAnalytics: () => {},
  showEditProjects: false,
  setShowEditProjects: () => {},
  showKeyboardShortcuts: false,
  setShowKeyboardShortcuts: () => {},
  showAuth: false,
  setShowAuth: () => {},
  toasts: [],
  addToast: () => {},
});

export const useAppContextState = (): AppContextInterface => {
  const [editingTodoId, setEditingTodoId] = useState("");
  const [selectedTodoId, setSelectedTodoId] = useState("");
  const [showArchive, setShowArchive] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showEditProjects, setShowEditProjects] = useState(false);
  const [showProjectAnalytics, setShowProjectAnalytics] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (text: string) => {
    setToasts((prev) => [...prev, { id: uuidv4(), text }]);
  };

  return {
    editingTodoId,
    setEditingTodoId,
    selectedTodoId,
    setSelectedTodoId,
    showArchive,
    setShowArchive,
    showKeyboardShortcuts,
    setShowKeyboardShortcuts,
    showProjectAnalytics,
    setShowProjectAnalytics,
    showEditProjects,
    setShowEditProjects,
    showAuth,
    setShowAuth,
    toasts,
    addToast,
  };
};

export const useAppContext = () => useContext(AppCtx);

export const AppCtxProvider: React.FC = ({ children }) => {
  const context = useAppContextState();
  return <AppCtx.Provider value={context}>{children}</AppCtx.Provider>;
};

export const useReduxActionsWithContext = () => {
  const { addToast, setSelectedTodoId, setEditingTodoId } = useAppContext();
  const dispatch = useAppDispatch();
  const undoWithToast = () => {
    dispatch(undo());
    addToast("undo");
  };

  const redoWithToast = () => {
    dispatch(redo());
    addToast("redo");
  };

  const addTodoFromTemplateWithToast = (template: TodoTemplates) => {
    dispatch(addTodoFromTemplate(template));
    addToast(`New todo with ${template} template`);
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

  const addNewTodoAndStartEditing = () => {
    const newTodo = new Todo();
    dispatch(addNewTodo(newTodo));
    addToast("New todo added");
    setEditingTodoId(newTodo.id);
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
    sortTodosWithToast,
    onArchiveAllCompletedTodosWithToast,
    deleteTodoWithToast,
    archiveTodoWithToast,
    moveTodoWithToast,
    addNewTodoAndStartEditing,
    addTodoFromTemplateWithToast,
  };
};

export default AppCtx;
