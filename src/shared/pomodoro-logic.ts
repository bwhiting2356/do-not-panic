import { useState, useEffect } from "react";
import { POMODORO_TOTAL_SECONDS } from "./constants";

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
}

const defaultValue: PomodoroState = {
  timerStatus: TimerStatus.Stopped,
  segments: [],
};

export function usePomodoroState(): [
  PomodoroState,
  React.Dispatch<React.SetStateAction<PomodoroState>>
] {
  const key = "timer-state";
  const [state, setState] = useState<PomodoroState>(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      return JSON.parse(valueInLocalStorage);
    }
    return defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}

export const computeSecondsRemaining = (segments: TimerSegment[]) => {
  const milliseconds = segments.reduce((acc, curr) => {
    const startTime = new Date(curr.startTime);
    const endTime = curr.endTime ? new Date(curr.endTime) : new Date();
    const difference = endTime?.getTime() - startTime.getTime();
    return (acc += difference);
  }, 0);
  const secondsRemaining =
    POMODORO_TOTAL_SECONDS - Math.floor(milliseconds / 1000);
  if (secondsRemaining <= 0) return 0;
  return secondsRemaining;
};
