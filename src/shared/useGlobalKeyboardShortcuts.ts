import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useAppContext, useReduxActionsWithContext } from "../context/context";
import {
  selectTodosDueLater,
  selectTodosDueToday,
} from "../features/todos/selectors";
import { editTodo } from "../features/todos/todoSlice";
import { URL_PREFIX } from "./constants";
import { Due } from "./due.type";
import { Todo, TodoTemplates } from "./todo";
import { getTodoIdInfoForArrowSelection } from "./util";

export const useGlobalKeyboardShortcuts = () => {
  const todayTodos = useAppSelector(selectTodosDueToday);
  const laterTodos = useAppSelector(selectTodosDueLater);
  const dispatch = useAppDispatch();
  const {
    showKeyboardShortcuts,
    setShowKeyboardShortcuts,
    selectedTodoId,
    setSelectedTodoId,
    editingTodoId,
    setEditingTodoId,
    showEditProjects,
    setShowEditProjects,
    setShowProjectAnalytics
  } = useAppContext();
  const {
    addTodoFromTemplateWithToast,
    undoWithToast,
    redoWithToast,
    sortTodosWithToast,
    onArchiveAllCompletedTodosWithToast,
    moveTodoWithToast,
    archiveTodoWithToast,
    deleteTodoWithToast,
    addNewTodoAndStartEditing,
  } = useReduxActionsWithContext();

  useEffect(() => {
    const listenForKeyboardShortcuts = (event: KeyboardEvent) => {

      if (event.shiftKey && event.code === "Slash") {
        setShowKeyboardShortcuts(!showKeyboardShortcuts);
        setShowEditProjects(false);
        setShowProjectAnalytics(false);
      }

      if (showEditProjects) return;

      if (event.metaKey && event.key === "Enter") {
        addNewTodoAndStartEditing();
        setSelectedTodoId("");
      }

      if (event.metaKey && event.shiftKey && event.key === "1") {
        addTodoFromTemplateWithToast(TodoTemplates.StartDay);
      }

      if (event.metaKey && event.shiftKey && event.key === "2") {
        addTodoFromTemplateWithToast(TodoTemplates.StartWeek);
      }

      if (event.key === "Escape") {
        setEditingTodoId("");
      }

      if (event.metaKey && event.key === "z") {
        if (event.shiftKey) {
          redoWithToast();
        } else {
          undoWithToast();
        }
      }

      if (!Boolean(editingTodoId)) {
        if (event.key === "s") {
          sortTodosWithToast();
        }
        if (event.key === "v") {
          onArchiveAllCompletedTodosWithToast();
        }
        const allTodosOrdered = [...todayTodos, ...laterTodos];
        if (Boolean(selectedTodoId)) {
          const todoIdInfo = getTodoIdInfoForArrowSelection(
            allTodosOrdered,
            selectedTodoId
          );
          const todo = allTodosOrdered.find(
            ({ id }) => id === selectedTodoId
          ) as Todo;
          if (event.key === "m") {
            moveTodoWithToast(
              todo,
              todo?.due === Due.Later ? Due.Today : Due.Later
            );
          } else if (event.key === "a") {
            archiveTodoWithToast(todo);
          } else if (event.key === "d") {
            deleteTodoWithToast(todo);
          } else if (event.key === "e") {
            setEditingTodoId(todo.id);
            event.preventDefault();
          } else if (event.code === "ArrowDown") {
            event.preventDefault();
            todoIdInfo.nextTodoUUID &&
              setSelectedTodoId(todoIdInfo.nextTodoUUID);
          } else if (event.code === "ArrowUp") {
            event.preventDefault();
            todoIdInfo.previousTodoUUID &&
              setSelectedTodoId(todoIdInfo.previousTodoUUID);
          } else if (event.code === "Space") {
            dispatch(
              editTodo({ id: todo.id, newTodo: { ...todo, done: !todo.done } })
            );
            event.preventDefault();
          } else if (event.key === "Escape") {
            setSelectedTodoId("");
          } else if (event.key === "Enter") {
            const topLinkUrl = todo.links[0]?.url;
            if (topLinkUrl && topLinkUrl !== URL_PREFIX) {
              window.open(topLinkUrl, "_blank", "noopener,noreferrer");
            }
          }
        } else if (event.code === "ArrowDown") {
          const firstItem = allTodosOrdered[0];
          setSelectedTodoId(firstItem?.id);
        }
      }
    };
    window.addEventListener("keydown", listenForKeyboardShortcuts);
    return () =>
      window.removeEventListener("keydown", listenForKeyboardShortcuts);
  });
};
