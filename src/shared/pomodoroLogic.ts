import { useState, useEffect, useCallback } from "react";
import { POMODORO_BREAK_TIME, POMODORO_WORK_TIME } from "./constants";
import { padZeros } from "./util";

export enum TimerStatus {
  Playing,
  Paused,
  Stopped,
  Alarm,
}

export interface TimerSegment {
  startTime: Date;
  endTime?: Date;
}

interface PomodoroState {
  timerStatus: TimerStatus;
  segments: TimerSegment[];
  targetMinutes: number;
}

const defaultValue: PomodoroState = {
  timerStatus: TimerStatus.Stopped,
  segments: [],
  targetMinutes: POMODORO_WORK_TIME,
};

export function usePomodoroPersistentState(): [
  PomodoroState,
  React.Dispatch<React.SetStateAction<PomodoroState>>
] {
  const key = "timer-state";
  const [state, setState] = useState<PomodoroState>(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      const parsed = JSON.parse(valueInLocalStorage);
      if (!parsed.targetMinutes) {
        // for migration
        parsed.targetMinutes = POMODORO_WORK_TIME;
      }
      return parsed;
    }
    return defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}

export const computeSecondsRemaining = (
  segments: TimerSegment[],
  targetMinutes: number
) => {
  const milliseconds = segments.reduce((acc, curr) => {
    const startTime = new Date(curr.startTime);
    const endTime = curr.endTime ? new Date(curr.endTime) : new Date();
    const difference = endTime?.getTime() - startTime.getTime();
    return (acc += difference);
  }, 0);
  const totalSeconds = targetMinutes * 60;
  const secondsRemaining = totalSeconds - Math.floor(milliseconds / 1000);
  if (secondsRemaining <= 0) return 0;
  return secondsRemaining;
};

export function usePomodoroLogic(audioRef: React.RefObject<HTMLAudioElement>) {
  const [{ timerStatus, segments, targetMinutes }, setState] =
    usePomodoroPersistentState();
  const [interval, setInterval] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState(
    computeSecondsRemaining(segments, targetMinutes)
  );
  const minutesDisplay = padZeros(Math.floor(secondsRemaining / 60));
  const secondsDisplay = padZeros(secondsRemaining % 60);

  const playSound = () => audioRef?.current?.play();

  const stopSound = () => {
    if (audioRef?.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const recomputeTimeRemaining = useCallback(() => {
    const newSecondsRemaining = computeSecondsRemaining(
      segments,
      targetMinutes
    );
    if (newSecondsRemaining === 0 && timerStatus !== TimerStatus.Alarm) {
      setState((prev) => ({
        ...prev,
        timerStatus: TimerStatus.Alarm,
      }));
      playSound();

      setTimeout(() => {
        setState((prev) => {
          const newTarget =
            prev.targetMinutes === POMODORO_WORK_TIME
              ? POMODORO_BREAK_TIME
              : POMODORO_WORK_TIME;
          return {
            targetMinutes: newTarget,
            timerStatus: TimerStatus.Stopped,
            segments: [],
          };
        });
      }, 2000);
    }
    setSecondsRemaining(newSecondsRemaining);
  }, [
    segments,
    setState,
    setSecondsRemaining,
    targetMinutes,
    timerStatus,
    playSound,
  ]);

  useEffect(() => {
    recomputeTimeRemaining();

    if (timerStatus === TimerStatus.Playing) {
      const newInterval = window.setInterval(() => {
        recomputeTimeRemaining();
      }, 1000);
      setInterval(newInterval);
    }

    return window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerStatus, targetMinutes]);

  const onPlay = () => {
    setState((prev) => {
      const newSegments: TimerSegment[] = [
        ...prev.segments,
        { startTime: new Date() },
      ];
      return {
        ...prev,
        timerStatus: TimerStatus.Playing,
        segments: newSegments,
      };
    });
  };
  const onPause = () => {
    setState((prev) => {
      const segmentsCopy = [...prev.segments];
      segmentsCopy[segmentsCopy.length - 1].endTime = new Date();
      return {
        ...prev,
        timerStatus: TimerStatus.Paused,
        segments: segmentsCopy,
      };
    });
  };

  const onStop = () => {
    stopSound();
    setState((prev) => ({
      ...prev,
      timerStatus: TimerStatus.Stopped,
      segments: [],
    }));
  };

  const onSetTargetToWork = () => {
    setState({
      timerStatus: TimerStatus.Stopped,
      segments: [],
      targetMinutes: POMODORO_WORK_TIME,
    });
  };

  const onSetTargetToBreak = () => {
    setState({
      timerStatus: TimerStatus.Stopped,
      segments: [],
      targetMinutes: POMODORO_BREAK_TIME,
    });
  };

  return {
    minutesDisplay,
    secondsDisplay,
    timerStatus,
    onPlay,
    onPause,
    onStop,
    onSetTargetToWork,
    onSetTargetToBreak,
  };
}
