import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  useAppContext,
  useReduxActionsWithContext,
} from "../../context/context";
import { selectTemplates } from "../../features/templates/selectors";
import {
  moveTemplateDown,
  moveTemplateUp,
} from "../../features/templates/templateSlice";
import { Template } from "../../shared/template";
import { getItemIdInfoForArrowSelection } from "../../shared/util";
import { useCommonKeyboardShortcuts } from "../useCommonKeyboardShortcuts";

export const useTemplatesKeyboardShortcuts = () => {
  const dispatch = useAppDispatch();
  useCommonKeyboardShortcuts();
  const templates = useAppSelector(selectTemplates);
  const { selectedItemId, setSelectedItemId, editingItemId, setEditingItemId } =
    useAppContext();
  const {
    redoTemplatesWithToast,
    undoTemplatesWithToast,
    addNewTemplateAndStartEditing,
    deleteTemplateWithToast,
    addToast,
  } = useReduxActionsWithContext();

  const onMoveTemplateUp = (arrayIdx: number) => {
    if (arrayIdx !== 0) {
      dispatch(moveTemplateUp({ index: arrayIdx }));
    }
  };

  const onMoveTemplateDown = (arrayIdx: number) => {
    if (arrayIdx !== templates.length - 1) {
      dispatch(moveTemplateDown({ index: arrayIdx }));
    }
  };

  useEffect(() => {
    const listenForKeyboardShortcuts = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "Enter") {
        addNewTemplateAndStartEditing();
        setSelectedItemId("");
      }

      if (event.metaKey && event.key === "z") {
        if (event.shiftKey) {
          redoTemplatesWithToast();
        } else {
          undoTemplatesWithToast();
        }
      }

      if (event.key === "Escape") {
        setEditingItemId("");
      }

      if (editingItemId) return;

      /** active editing item shortcuts **/

      if (selectedItemId && templates.find(({ id }) => id === selectedItemId)) {
        const projectIdInfo = getItemIdInfoForArrowSelection(
          templates,
          selectedItemId
        );
        const template = templates.find(
          ({ id }) => id === selectedItemId
        ) as Template;
        const arrayIdx = templates.indexOf(template);

        const isDefaultTemplate =
          template.templateTitle.toLowerCase() === "default";

        if (event.key === "d") {
          if (isDefaultTemplate) {
            addToast(`Cannot delete default template`);
          } else {
            deleteTemplateWithToast(template);
          }
        } else if (event.key === "e") {
          setEditingItemId(template.id);
          event.preventDefault();
        } else if (event.key === "]") {
          onMoveTemplateUp(arrayIdx);
        } else if (event.key === "[") {
          onMoveTemplateDown(arrayIdx);
        } else if (event.code === "ArrowDown") {
          event.preventDefault();
          if (projectIdInfo.nextItemUUID) {
            setSelectedItemId(projectIdInfo.nextItemUUID);
          }
        } else if (event.code === "ArrowUp") {
          event.preventDefault();
          if (projectIdInfo.previousItemUUID) {
            setSelectedItemId(projectIdInfo.previousItemUUID);
          }
        } else if (event.key === "Escape") {
          setSelectedItemId("");
        }
      } else if (event.code === "ArrowDown") {
        const [firstItem] = templates;
        setSelectedItemId(firstItem?.id);
      }
    };
    window.addEventListener("keydown", listenForKeyboardShortcuts);
    return () =>
      window.removeEventListener("keydown", listenForKeyboardShortcuts);
  });
};
