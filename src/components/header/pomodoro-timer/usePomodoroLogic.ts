import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  computeSecondsRemaining,
  createTimeDisplay,
  sendSMSNotification,
  updateTabIcon,
} from "./helpers";
import { useAppSelector } from "../../../app/hooks";
import {
  selectSegments,
  selectTargetMinutes,
  selectTimerStatus,
} from "../../../features/timer/selectors";
import {
  clearSegments,
  editTargetMinutes,
  editTimerStatus,
  onPauseTimer,
  onPlayTimer,
  onStopTimer,
  TimerStatus,
} from "../../../features/timer/timerSlice";

import { MILLISECONDS_PER_SECOND } from "../../../shared/constants";
import { selectActiveTodo } from "../../../features/todos/selectors";
import { editTodo } from "../../../features/todos/todoSlice";
import {
  selectPhoneNumber,
  selectPomodoroBreakTime,
  selectPomodoroWorkTime,
} from "../../../features/settings/selectors";

export function usePomodoroLogic(audioRef: React.RefObject<HTMLAudioElement>) {
  const dispatch = useDispatch();
  const activeTodo = useAppSelector(selectActiveTodo);
  const pomodoroWorkMinutes = useAppSelector(selectPomodoroWorkTime);
  const pomodoroBreakMinutes = useAppSelector(selectPomodoroBreakTime);
  const phoneNumber = useAppSelector(selectPhoneNumber);
  const timerStatus = useAppSelector(selectTimerStatus);
  const segments = useAppSelector(selectSegments);
  const targetMinutes = useAppSelector(selectTargetMinutes);
  const [interval, setInterval] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState(
    computeSecondsRemaining(segments, targetMinutes)
  );
  const recomputeSecondsRemaining = () => {
    const newSecondsRemaining = computeSecondsRemaining(
      segments,
      targetMinutes
    );
    setSecondsRemaining(newSecondsRemaining);
  };

  const setTimerStatus = useCallback(
    (newTimerStatus: TimerStatus) => {
      dispatch(editTimerStatus(newTimerStatus));
    },
    [dispatch]
  );

  const setTargetMinutes = useCallback(
    (newTargetMinutes: number) => {
      dispatch(editTargetMinutes(newTargetMinutes));
    },
    [dispatch]
  );

  const playSound = useCallback(() => audioRef?.current?.play(), [audioRef]);

  const stopSound = () => {
    if (audioRef?.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    updateTabIcon(targetMinutes, timerStatus, pomodoroWorkMinutes);
  }, [targetMinutes, timerStatus, pomodoroWorkMinutes]);

  useEffect(() => {
    document.title = createTimeDisplay(secondsRemaining);

    // when the timer hits 0
    if (secondsRemaining === 0 && timerStatus !== TimerStatus.Alarm) {
      setTimerStatus(TimerStatus.Alarm);
      playSound();
      if (targetMinutes === pomodoroBreakMinutes && phoneNumber) {
        sendSMSNotification(phoneNumber);
      }
      if (targetMinutes === pomodoroWorkMinutes && activeTodo) {
        const newCompletedPoms = parseInt(activeTodo.completedPoms || "0") + 1;
        dispatch(
          editTodo({
            id: activeTodo.id,
            newTodo: {
              ...activeTodo,
              completedPoms: newCompletedPoms.toString(),
            },
          })
        );
      }

      setTimeout(() => {
        setTimerStatus(TimerStatus.Stopped);
        const newTarget =
          targetMinutes === pomodoroWorkMinutes
            ? pomodoroBreakMinutes
            : pomodoroWorkMinutes;
        setTargetMinutes(newTarget);
        dispatch(clearSegments());
        // eslint-disable-next-line no-magic-numbers
      }, MILLISECONDS_PER_SECOND * 2);
    }
  }, [
    secondsRemaining,
    setTimerStatus,
    setTargetMinutes,
    playSound,
    dispatch,
    timerStatus,
    targetMinutes,
    phoneNumber,
    activeTodo,
    pomodoroBreakMinutes,
    pomodoroWorkMinutes,
  ]);

  useEffect(() => {
    recomputeSecondsRemaining();

    if (timerStatus === TimerStatus.Playing) {
      const newInterval = window.setInterval(() => {
        recomputeSecondsRemaining();
      }, MILLISECONDS_PER_SECOND);
      setInterval(() => newInterval);
    }

    return window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerStatus, targetMinutes]);

  const onPlay = () => dispatch(onPlayTimer());
  const onPause = () => dispatch(onPauseTimer());

  const onStop = () => {
    stopSound();
    dispatch(onStopTimer());
  };

  const onSetTargetToWork = () => {
    setTargetMinutes(pomodoroWorkMinutes);
    dispatch(onStopTimer());
  };

  const onSetTargetToBreak = () => {
    setTargetMinutes(pomodoroBreakMinutes);
    dispatch(onStopTimer());
  };

  useEffect(() => {
    const listenForKeyboardShortcuts = (event: KeyboardEvent) => {
      if (event.code === "Space") {
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

  return {
    timeDisplay: createTimeDisplay(secondsRemaining),
    onPlay,
    onPause,
    onStop,
    onSetTargetToBreak,
    onSetTargetToWork,
    targetMinutes,
    timerStatus,
  };
}
