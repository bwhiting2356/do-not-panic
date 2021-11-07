import { createContext, useContext } from "react";
import { ID } from "../shared/id.type";

export interface AppContextInterface {
  editingTodoId: ID;
  setEditingTodoId: (id: ID) => void;
}

const AppCtx = createContext<AppContextInterface>({
  editingTodoId: "",
  setEditingTodoId: () => {},
});
export const useAppContext = () => useContext(AppCtx);
export default AppCtx;
