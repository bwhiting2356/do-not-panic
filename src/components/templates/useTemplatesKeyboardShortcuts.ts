import { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { useAppContext, useReduxActionsWithContext } from "../../context/context";
import { selectTemplates } from "../../features/templates/selectors";
import { Template } from "../../shared/template";
import { getItemIdInfoForArrowSelection } from "../../shared/util";
import { useCommonKeyboardShortcuts } from "../useCommonKeyboardShortcuts";

export const useTemplatesKeyboardShortcuts = () => {
  useCommonKeyboardShortcuts()
  const templates = useAppSelector(selectTemplates);
  const {
    selectedItemId,
    setSelectedItemId,
    editingItemId,
    setEditingItemId,
  } = useAppContext();
  const {
    redoTemplatesWithToast,
    undoTemplatesWithToast,
    addNewTemplateAndStartEditing,
    deleteTemplateWithToast,
  } = useReduxActionsWithContext();

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

      if (!Boolean(editingItemId)) {
        if (Boolean(selectedItemId && templates.find(({ id }) => id === selectedItemId))) {
          const projectIdInfo = getItemIdInfoForArrowSelection(
            templates,
            selectedItemId
          );
          const template = templates.find(
            ({ id }) => id === selectedItemId
          ) as Template;
          
          if (event.key === "d") {
            deleteTemplateWithToast(template);
          } else if (event.key === "e") {
            setEditingItemId(template.id);
            event.preventDefault();
          } else if (event.code === "ArrowDown") {
            event.preventDefault();
            projectIdInfo.nextItemUUID &&
              setSelectedItemId(projectIdInfo.nextItemUUID);
          } else if (event.code === "ArrowUp") {
            event.preventDefault();
            projectIdInfo.previousItemUUID &&
              setSelectedItemId(projectIdInfo.previousItemUUID);
          } else if (event.key === "Escape") {
            setSelectedItemId("");
          } 
        } else if (event.code === "ArrowDown") {
          const firstItem = templates[0];
          setSelectedItemId(firstItem?.id);
        }
      }
    };
    window.addEventListener("keydown", listenForKeyboardShortcuts);
    return () =>
      window.removeEventListener("keydown", listenForKeyboardShortcuts);
  });
};
