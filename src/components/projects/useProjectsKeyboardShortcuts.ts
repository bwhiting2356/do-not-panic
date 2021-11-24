import { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { useAppContext, useReduxActionsWithContext } from "../../context/context";
import { selectCurrentProjects } from "../../features/projects/selectors";
import { Project } from "../../shared/project";
import { getItemIdInfoForArrowSelection } from "../../shared/util";
import { useCommonKeyboardShortcuts } from "../useCommonKeyboardShortcuts";

export const useProjectsKeyboardShortcuts = () => {
  useCommonKeyboardShortcuts()
  const currentProjects = useAppSelector(selectCurrentProjects);
  const {
    selectedItemId,
    setSelectedItemId,
    editingItemId,
    setEditingItemId,
  } = useAppContext();
  const {
    redoProjectsWithToast,
    undoProjectsWithToast,
    addNewProjectAndStartEditing,
  } = useReduxActionsWithContext();

  useEffect(() => {
    const listenForKeyboardShortcuts = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "Enter") {
        addNewProjectAndStartEditing();
        setSelectedItemId("");
      }

      if (event.metaKey && event.key === "z") {
        if (event.shiftKey) {
          redoProjectsWithToast();
        } else {
          undoProjectsWithToast();
        }
      }

      if (event.key === "Escape") {
        setEditingItemId("");
      }

      if (!Boolean(editingItemId)) {
        if (Boolean(selectedItemId && currentProjects.find(({ id }) => id === selectedItemId))) {
          const projectIdInfo = getItemIdInfoForArrowSelection(
            currentProjects,
            selectedItemId
          );
          const project = currentProjects.find(
            ({ id }) => id === selectedItemId
          ) as Project;
          if (event.key === "e") {
            setEditingItemId(project.id);
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
          const firstItem = currentProjects[0];
          setSelectedItemId(firstItem?.id);
        }
      }
    };
    window.addEventListener("keydown", listenForKeyboardShortcuts);
    return () =>
      window.removeEventListener("keydown", listenForKeyboardShortcuts);
  });
};
