import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { selectPhoneNumber } from "../../features/settings/selectors";
import {
  selectSegments,
  selectTargetMinutes,
  selectTimerStatus,
} from "../../features/timer/selectors";
import {
  clearSegments,
  editTargetMinutes,
  editTimerStatus,
  onPauseTimer,
  onPlayTimer,
  onStopTimer,
  TimerSegment,
  TimerStatus,
} from "../../features/timer/timerSlice";
import BlueCircle from "../../images/blue-circle.svg";
import GreyCircle from "../../images/grey-circle.svg";
import RedCircle from "../../images/red-circle.svg";

import {
  MILLISECONDS_PER_SECOND,
  POMODORO_BREAK_TIME,
  POMODORO_WORK_TIME,
  SECONDS_PER_MINUTE,
  TWILLIO_URL,
} from "../../shared/constants";
import { padZeros } from "../../shared/util";

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

export const createTimeDisplay = (secondsRemaining: number): string => {
  const minutesDisplay = padZeros(
    Math.floor(secondsRemaining / SECONDS_PER_MINUTE)
  );
  const secondsDisplay = padZeros(secondsRemaining % SECONDS_PER_MINUTE);
  return `${minutesDisplay}:${secondsDisplay}`;
};

export const getIcon = (targetMinutes: number, timerStatus: TimerStatus) => {
  if (timerStatus === TimerStatus.Stopped) {
    return GreyCircle;
  } else if (targetMinutes === POMODORO_WORK_TIME) {
    return RedCircle;
  } else {
    return BlueCircle;
  }
};

const updateTabIcon = (targetMinutes: number, timerStatus: TimerStatus) => {
  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  link.href = getIcon(targetMinutes, timerStatus);
};

export const sendSMSNotification = (phoneNumber: string) => {
  fetch(TWILLIO_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phoneNumber,
    }),
    // eslint-disable-next-line no-console
  }).catch(console.log);
};

export const getBadgeBackgroundClass = (
  timerStatus: TimerStatus,
  targetMinutes: number
) => {
  if (timerStatus === TimerStatus.Playing) {
    if (targetMinutes === POMODORO_WORK_TIME) {
      return "pomodoro-badge";
    } else {
      return "break-badge";
    }
  } else {
    return "stopped-badge";
  }
};

export function usePomodoroLogic(audioRef: React.RefObject<HTMLAudioElement>) {
  const dispatch = useDispatch();
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
    updateTabIcon(targetMinutes, timerStatus);
  }, [targetMinutes, timerStatus]);

  useEffect(() => {
    document.title = createTimeDisplay(secondsRemaining);
    if (secondsRemaining === 0 && timerStatus !== TimerStatus.Alarm) {
      setTimerStatus(TimerStatus.Alarm);
      playSound();
      if (targetMinutes === POMODORO_BREAK_TIME && phoneNumber) {
        sendSMSNotification(phoneNumber);
      }

      setTimeout(() => {
        setTimerStatus(TimerStatus.Stopped);
        const newTarget =
          targetMinutes === POMODORO_WORK_TIME
            ? POMODORO_BREAK_TIME
            : POMODORO_WORK_TIME;
        setTargetMinutes(newTarget);
        dispatch(clearSegments);
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
    setTargetMinutes(POMODORO_WORK_TIME);
    dispatch(onStopTimer());
  };

  const onSetTargetToBreak = () => {
    setTargetMinutes(POMODORO_BREAK_TIME);
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
