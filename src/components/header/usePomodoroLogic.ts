import { useCallback, useEffect, useState } from "react";
import {
  MILLISECONDS_PER_SECOND,
  POMODORO_BREAK_TIME,
  POMODORO_WORK_TIME,
  SECONDS_PER_MINUTE,
} from "../../shared/constants";
import { padZeros } from "../../shared/util";

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
  segments: TimerSegment[];
  targetMinutes: number;
  timerStatus: TimerStatus;
}

const defaultValue: PomodoroState = {
  segments: [],
  targetMinutes: POMODORO_WORK_TIME,
  timerStatus: TimerStatus.Stopped,
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
    const difference = endTime.getTime() - startTime.getTime();
    return acc + difference;
  }, 0);
  const totalSeconds = targetMinutes * SECONDS_PER_MINUTE;
  const secondsRemaining =
    totalSeconds - Math.floor(milliseconds / MILLISECONDS_PER_SECOND);
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
  const minutesDisplay = padZeros(
    Math.floor(secondsRemaining / SECONDS_PER_MINUTE)
  );
  const secondsDisplay = padZeros(secondsRemaining % SECONDS_PER_MINUTE);

  const playSound = useCallback(() => audioRef?.current?.play(), [audioRef]);

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
            segments: [],
            targetMinutes: newTarget,
            timerStatus: TimerStatus.Stopped,
          };
        });
        // eslint-disable-next-line no-magic-numbers
      }, MILLISECONDS_PER_SECOND * 2);
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
      }, MILLISECONDS_PER_SECOND);
      setInterval(() => newInterval);
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
        segments: newSegments,
        timerStatus: TimerStatus.Playing,
      };
    });
  };
  const onPause = () => {
    setState((prev) => {
      const segmentsCopy = [...prev.segments];
      segmentsCopy[segmentsCopy.length - 1].endTime = new Date();
      return {
        ...prev,
        segments: segmentsCopy,
        timerStatus: TimerStatus.Paused,
      };
    });
  };

  const onStop = () => {
    stopSound();
    setState((prev) => ({
      ...prev,
      segments: [],
      timerStatus: TimerStatus.Stopped,
    }));
  };

  const onSetTargetToWork = () => {
    setState({
      segments: [],
      targetMinutes: POMODORO_WORK_TIME,
      timerStatus: TimerStatus.Stopped,
    });
  };

  const onSetTargetToBreak = () => {
    setState({
      segments: [],
      targetMinutes: POMODORO_BREAK_TIME,
      timerStatus: TimerStatus.Stopped,
    });
  };

  return {
    minutesDisplay,
    onPause,
    onPlay,
    onSetTargetToBreak,
    onSetTargetToWork,
    onStop,
    secondsDisplay,
    targetMinutes,
    timerStatus,
  };
}
