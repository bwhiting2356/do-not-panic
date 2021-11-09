import { createContext, useContext, useState } from "react";
import { ID } from "../shared/id.type";

export interface AppContextInterface {
  editingTodoId: ID;
  selectedTodoId: ID;
  setEditingTodoId: (id: ID) => void;
  setSelectedTodoId: (id: ID) => void;
  showNewTodo: boolean,
  setShowNewTodo: (show: boolean) => void;
}

const AppCtx = createContext<AppContextInterface>({
  editingTodoId: "",
  selectedTodoId: "",
  setEditingTodoId: () => {},
  setSelectedTodoId: () => {},
  showNewTodo: false,
  setShowNewTodo: () => {}
});

export const useAppContextState = (): AppContextInterface => {
  const [editingTodoId, setEditingTodoId] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState('');
  const [showNewTodo, setShowNewTodo] = useState(false);

  return {
    editingTodoId,
    setEditingTodoId,
    selectedTodoId,
    setSelectedTodoId,
    showNewTodo,
    setShowNewTodo
  }
}

export const useAppContext = () => useContext(AppCtx);
export default AppCtx;
