/* eslint-disable no-console */
import {
  TWILLIO_URL,
  SECONDS_PER_MINUTE,
  MILLISECONDS_PER_SECOND,
} from "./constants";
import { padZeros } from "./util";
import { TimerStatus, TimerSegment } from "../features/timer/timerSlice";

import BlueCircle from "../images/blue-circle.svg";
import GreyCircle from "../images/grey-circle.svg";
import RedCircle from "../images/red-circle.svg";

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
  })
    .then(console.log)
    .catch(console.log);
};

export const getBadgeBackgroundClass = (
  timerStatus: TimerStatus,
  targetMinutes: number,
  pomodoroWorkMinutes: number
) => {
  if (timerStatus === TimerStatus.Playing) {
    if (targetMinutes === pomodoroWorkMinutes) {
      return "pomodoro-badge";
    } else {
      return "break-badge";
    }
  } else {
    return "stopped-badge";
  }
};

export const getIcon = (
  targetMinutes: number,
  timerStatus: TimerStatus,
  pomodoroWorkMinutes: number
) => {
  if (timerStatus === TimerStatus.Stopped) {
    return GreyCircle;
  } else if (targetMinutes === pomodoroWorkMinutes) {
    return RedCircle;
  } else {
    return BlueCircle;
  }
};

export const updateTabIcon = (
  targetMinutes: number,
  timerStatus: TimerStatus,
  pomodoroWorkMinutes: number
) => {
  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  link.href = getIcon(targetMinutes, timerStatus, pomodoroWorkMinutes);
};

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
