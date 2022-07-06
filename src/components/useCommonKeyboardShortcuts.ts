import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { store } from "../app/store";
import { useAppContext } from "../context/context";
import { downloadBackupFromState } from "../shared/util";
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
        downloadBackupFromState(store.getState());
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
