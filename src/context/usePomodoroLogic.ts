import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../app/hooks";
import {
  selectSecondsRemaining,
  selectTargetMinutes,
  selectTimerStatus,
} from "../features/timer/selectors";
import {
  clearSegments,
  editTargetMinutes,
  editTimerStatus,
  onPauseTimer,
  onPlayTimer,
  onStopTimer,
  TimerStatus,
  updateSecondsRemaining,
} from "../features/timer/timerSlice";

import { MILLISECONDS_PER_SECOND } from "../shared/constants";
import { selectActiveTodo } from "../features/todos/selectors";
import { editTodo } from "../features/todos/todoSlice";
import {
  selectPhoneNumber,
  selectPomodoroBreakTime,
  selectPomodoroWorkTime,
} from "../features/settings/selectors";
import {
  createTimeDisplay,
  sendSMSNotification,
  updateTabIcon,
} from "../shared/pomodoro-helpers";

export interface PomodoroLogic {
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSetTargetToBreak: () => void;
  onSetTargetToWork: () => void;
}

export function usePomodoroLogic(
  audioRef: React.RefObject<HTMLAudioElement>
): PomodoroLogic {
  const dispatch = useDispatch();
  const activeTodo = useAppSelector(selectActiveTodo);
  const pomodoroWorkMinutes = useAppSelector(selectPomodoroWorkTime);
  const pomodoroBreakMinutes = useAppSelector(selectPomodoroBreakTime);
  const phoneNumber = useAppSelector(selectPhoneNumber);
  const timerStatus = useAppSelector(selectTimerStatus);
  const targetMinutes = useAppSelector(selectTargetMinutes);
  const secondsRemaining = useAppSelector(selectSecondsRemaining);
  const [interval, setInterval] = useState<number>(0);

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

  const playSound = useCallback(async () => {
    try {
      if (audioRef?.current) {
        await audioRef.current.play();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }, [audioRef]);

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

      setTimeout(() => {
        if (
          targetMinutes === pomodoroWorkMinutes &&
          activeTodo &&
          timerStatus !== TimerStatus.Stopped
        ) {
          const newCompletedPoms =
            parseInt(activeTodo.completedPoms || "0") + 1;
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
    dispatch(updateSecondsRemaining());

    if (timerStatus === TimerStatus.Playing) {
      const newInterval = window.setInterval(() => {
        dispatch(updateSecondsRemaining());
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
    // make into a combined action
    setTargetMinutes(pomodoroWorkMinutes);
    dispatch(onStopTimer());
    dispatch(updateSecondsRemaining());
  };

  const onSetTargetToBreak = () => {
    // make into a combined action
    setTargetMinutes(pomodoroBreakMinutes);
    dispatch(onStopTimer());
    dispatch(updateSecondsRemaining());
  };

  return {
    onPlay,
    onPause,
    onStop,
    onSetTargetToBreak,
    onSetTargetToWork,
  };
}
