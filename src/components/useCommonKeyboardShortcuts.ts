import { useEffect } from "react";
import moment from "moment";
import { store } from "../app/store";
import { useAppContext } from "../context/context";
import { createCSVContents, download } from "../shared/util";

export const useCommonKeyboardShortcuts = () => {
  const {
    showKeyboardShortcuts,
    setShowKeyboardShortcuts,
    setShowProjectAnalytics,
  } = useAppContext();

  useEffect(() => {
    const listenForKeyboardShortcuts = (event: KeyboardEvent) => {
      // show keyboard shortcuts modal
      if (event.shiftKey && event.code === "Slash") {
        setShowKeyboardShortcuts(!showKeyboardShortcuts);
        // hide all other modals
        setShowProjectAnalytics(false);
      }

      // download backups
      if (event.metaKey && event.key === "x") {
        const state = store.getState();
        const time = moment().format("MMMM Do YYYY, h:mm:ss a");
        download(`backup-${time}.json`, JSON.stringify(state));
        download(
          `todos-${time}.csv`,
          createCSVContents(state.todos.currentState.todos)
        );
      }
    };
    window.addEventListener("keydown", listenForKeyboardShortcuts);
    return () =>
      window.removeEventListener("keydown", listenForKeyboardShortcuts);
  });
};
