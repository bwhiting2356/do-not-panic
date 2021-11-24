import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addNewProject,
  deleteProject,
  editProject,
  redoProjects,
  undoProjects,
} from "../features/projects/projectSlice";
import { selectCurrentProjects } from "../features/projects/selectors";
import {
  addNewTemplate,
  deleteTemplate,
  redoTemplates,
  undoTemplates,
} from "../features/templates/templateSlice";
import {
  undoTodos,
  redoTodos,
  archiveAllCompletedTodos,
  resortTodos,
  addTodoFromTemplate,
  editTodo,
  deleteTodo,
  addNewTodo,
} from "../features/todos/todoSlice";
import { Due } from "../shared/due.type";

import { ID } from "../shared/id.type";
import { Project } from "../shared/project";
import { Template } from "../shared/template";
import { Todo, TodoTemplates } from "../shared/todo";

interface ToastData {
  id: ID;
  text: string;
}

export interface AppContextInterface {
  editingItemId: ID;
  selectedItemId: ID;
  setEditingItemId: (id: ID) => void;
  setSelectedItemId: (id: ID) => void;
  showArchive: boolean;
  setShowArchive: (show: boolean) => void;
  showProjectAnalytics: boolean;
  setShowProjectAnalytics: (show: boolean) => void;
  showKeyboardShortcuts: boolean;
  setShowKeyboardShortcuts: (show: boolean) => void;
  toasts: ToastData[];
  addToast: (newToast: string) => void;
  showAnimation: boolean;
  setShowAnimation: (show: boolean) => void;
}

const AppCtx = createContext<AppContextInterface>({
  editingItemId: "",
  selectedItemId: "",
  setEditingItemId: () => {},
  setSelectedItemId: () => {},
  showArchive: false,
  setShowArchive: () => {},
  showProjectAnalytics: false,
  setShowProjectAnalytics: () => {},
  showKeyboardShortcuts: false,
  setShowKeyboardShortcuts: () => {},
  toasts: [],
  addToast: () => {},
  showAnimation: false,
  setShowAnimation: () => {},
});

export const useAppContextState = (): AppContextInterface => {
  const [editingItemId, setEditingItemId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [showArchive, setShowArchive] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showProjectAnalytics, setShowProjectAnalytics] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (text: string) => {
    setToasts((prev) => [...prev, { id: uuidv4(), text }]);
  };

  return {
    editingItemId,
    setEditingItemId,
    selectedItemId,
    setSelectedItemId,
    showArchive,
    setShowArchive,
    showKeyboardShortcuts,
    setShowKeyboardShortcuts,
    showProjectAnalytics,
    setShowProjectAnalytics,
    showAnimation,
    setShowAnimation,
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
  const { addToast, setSelectedItemId, setEditingItemId } = useAppContext();
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectCurrentProjects);
  const noneProject = projects.find(
    (project) => project.title.toLowerCase() === "none"
  );

  /** TODOS **/

  const undoTodosWithToast = () => {
    dispatch(undoTodos());
    addToast("undo");
  };

  const redoTodosWithToast = () => {
    dispatch(redoTodos());
    addToast("redo");
  };

  const undoProjectsWithToast = () => {
    dispatch(undoProjects());
    addToast("undo");
  };

  const redoProjectsWithToast = () => {
    dispatch(redoProjects());
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
    setSelectedItemId("");
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
    setSelectedItemId("");
  };

  const addNewTodoAndStartEditing = () => {
    const newTodo = new Todo();
    dispatch(addNewTodo(newTodo));
    addToast("New todo added");
    setEditingItemId(newTodo.id);
  };

  /** PROJECTS **/

  const deleteProjectWithToast = (project: Project) => {
    dispatch(deleteProject({ id: project.id }));
    addToast(`${project.title} deleted`);
    setSelectedItemId("");
  };

  const addNewProjectAndStartEditing = () => {
    const newProject = new Project();
    dispatch(addNewProject(newProject));
    addToast("New project added");
    setEditingItemId(newProject.id);
  };

  const archiveProjectWithToast = (project: Project) => {
    dispatch(
      editProject({
        id: project.id,
        newProject: {
          ...project,
          archivedDate: new Date(),
        },
      })
    );
    addToast(`${project.title} archived`);
    setSelectedItemId("");
  };

  const removeProjectFromArchiveWithToast = (project: Project) => {
    dispatch(
      editProject({
        id: project.id,
        newProject: {
          ...project,
          archivedDate: undefined,
        },
      })
    );
    addToast(`${project.title} removed from archived`);
    setSelectedItemId("");
  };

  /** TEMPLATES **/

  const addNewTemplateAndStartEditing = () => {
    const newTemplate = new Template("", noneProject?.id as string);
    dispatch(addNewTemplate(newTemplate));
    addToast("New template added");
    setEditingItemId(newTemplate.id);
  };

  const deleteTemplateWithToast = (template: Template) => {
    dispatch(deleteTemplate({ id: template.id }));
    addToast(`${template.templateTitle} deleted`);
    setSelectedItemId("");
  };

  const undoTemplatesWithToast = () => {
    dispatch(undoTemplates());
    addToast("undo");
  };

  const redoTemplatesWithToast = () => {
    dispatch(redoTemplates());
    addToast("redo");
  };

  return {
    /** TODOS */
    undoTodosWithToast,
    redoTodosWithToast,
    sortTodosWithToast,
    onArchiveAllCompletedTodosWithToast,
    deleteTodoWithToast,
    archiveTodoWithToast,
    moveTodoWithToast,
    addNewTodoAndStartEditing,
    addTodoFromTemplateWithToast, // TODO: remove

    /** PROJECTS **/
    undoProjectsWithToast,
    redoProjectsWithToast,
    addNewProjectAndStartEditing,
    deleteProjectWithToast,
    archiveProjectWithToast,
    removeProjectFromArchiveWithToast,

    /** TEMPLATES */
    undoTemplatesWithToast,
    redoTemplatesWithToast,
    addNewTemplateAndStartEditing,
    deleteTemplateWithToast,
    addToast,
  };
};

export default AppCtx;
