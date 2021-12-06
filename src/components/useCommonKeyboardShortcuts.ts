import { useEffect } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { store } from "../app/store";
import { useAppContext } from "../context/context";
import { createCSVContents, download } from "../shared/util";
import { useAppSelector } from "../app/hooks";
import { selectTimerStatus } from "../features/timer/selectors";
import {
  onPauseTimer,
  onPlayTimer,
  TimerStatus,
} from "../features/timer/timerSlice";

export const useCommonKeyboardShortcuts = () => {
  const dispatch = useDispatch();
  const { activeModal, setActiveModal, editingItemId } = useAppContext();
  const timerStatus = useAppSelector(selectTimerStatus);

  useEffect(() => {
    const listenForKeyboardShortcuts = (event: KeyboardEvent) => {
      // show keyboard shortcuts modal
      if (event.shiftKey && event.code === "Slash") {
        if (activeModal === "keyboard-shortcuts") {
          setActiveModal("");
        } else {
          setActiveModal("keyboard-shortcuts");
        }
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

      if (event.code === "Space" && !editingItemId) {
        event.preventDefault();
        if (timerStatus !== TimerStatus.Playing) {
          dispatch(onPlayTimer());
        } else if (timerStatus === TimerStatus.Playing) {
          dispatch(onPauseTimer());
        }
      }
    };
    window.addEventListener("keydown", listenForKeyboardShortcuts);
    return () =>
      window.removeEventListener("keydown", listenForKeyboardShortcuts);
  });
};
