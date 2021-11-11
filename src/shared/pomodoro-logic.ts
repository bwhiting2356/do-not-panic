import { useState, useEffect } from "react";
import { POMODORO_WORK_TIME } from "./constants";

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

export function usePomodoroState(): [
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
