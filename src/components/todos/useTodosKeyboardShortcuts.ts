import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  useAppContext,
  useReduxActionsWithContext,
} from "../../context/context";
import { selectDefaultTemplate } from "../../features/templates/selectors";
import {
  selectTodosDueLater,
  selectTodosDueToday,
} from "../../features/todos/selectors";
import { editTodo } from "../../features/todos/todoSlice";
import { URL_PREFIX } from "../../shared/constants";
import { Due } from "../../shared/due.type";
import { Todo } from "../../shared/todo";
import { getItemIdInfoForArrowSelection } from "../../shared/util";
import { useCommonKeyboardShortcuts } from "../useCommonKeyboardShortcuts";

export const useTodosKeyboardShortcuts = () => {
  useCommonKeyboardShortcuts();
  const todayTodos = useAppSelector(selectTodosDueToday);
  const laterTodos = useAppSelector(selectTodosDueLater);
  const defaultTemplate = useAppSelector(selectDefaultTemplate);
  const dispatch = useAppDispatch();
  const { selectedItemId, setSelectedItemId, editingItemId, setEditingItemId } =
    useAppContext();
  const {
    addTodoFromTemplateWithToast,
    sortTodosWithToast,
    onArchiveAllCompletedTodosWithToast,
    moveTodoWithToast,
    archiveTodoWithToast,
    deleteTodoWithToast,
    redoTodosWithToast,
    undoTodosWithToast,
  } = useReduxActionsWithContext();

  useEffect(() => {
    const listenForKeyboardShortcuts = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "Enter") {
        addTodoFromTemplateWithToast(defaultTemplate?.id || "");
        setSelectedItemId("");
      }

      if (event.metaKey && event.key === "z") {
        if (event.shiftKey) {
          redoTodosWithToast();
        } else {
          undoTodosWithToast();
        }
      }

      if (event.key === "Escape") {
        setEditingItemId("");
      }

      if (!Boolean(editingItemId)) {
        if (event.key === "s") {
          sortTodosWithToast();
        }
        if (event.key === "v") {
          onArchiveAllCompletedTodosWithToast();
        }
        const allTodosOrdered = [...todayTodos, ...laterTodos];
        if (
          Boolean(selectedItemId) &&
          allTodosOrdered.find(({ id }) => id === selectedItemId)
        ) {
          const todoIdInfo = getItemIdInfoForArrowSelection(
            allTodosOrdered,
            selectedItemId
          );
          const todo = allTodosOrdered.find(
            ({ id }) => id === selectedItemId
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
            setEditingItemId(todo.id);
            event.preventDefault();
          } else if (event.code === "ArrowDown") {
            event.preventDefault();
            todoIdInfo.nextItemUUID &&
              setSelectedItemId(todoIdInfo.nextItemUUID);
          } else if (event.code === "ArrowUp") {
            event.preventDefault();
            todoIdInfo.previousItemUUID &&
              setSelectedItemId(todoIdInfo.previousItemUUID);
          } else if (event.code === "Space") {
            dispatch(
              editTodo({ id: todo.id, newTodo: { ...todo, done: !todo.done } })
            );
            event.preventDefault();
          } else if (event.key === "Escape") {
            setSelectedItemId("");
          } else if (event.key === "Enter") {
            const topLinkUrl = todo.links[0]?.url;
            if (topLinkUrl && topLinkUrl !== URL_PREFIX) {
              window.open(topLinkUrl, "_blank", "noopener,noreferrer");
            }
          }
        } else if (event.code === "ArrowDown") {
          const firstItem = allTodosOrdered[0];
          setSelectedItemId(firstItem?.id);
        }
      }
    };
    window.addEventListener("keydown", listenForKeyboardShortcuts);
    return () =>
      window.removeEventListener("keydown", listenForKeyboardShortcuts);
  });
};
