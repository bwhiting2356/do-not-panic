import React, { useRef } from "react";
import { Badge, Button, ButtonGroup } from "react-bootstrap";
import { Pause, Play, Stop } from "react-bootstrap-icons";
import { POMODORO_BREAK_TIME, POMODORO_WORK_TIME } from "../shared/constants";
import { TimerStatus, usePomodoroLogic } from "../shared/pomodoroLogic";
export function PomodoroTimer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    minutesDisplay,
    secondsDisplay,
    timerStatus,
    onPlay,
    onPause,
    onStop,
    onSetTargetToWork,
    onSetTargetToBreak,
    targetMinutes,
  } = usePomodoroLogic(audioRef);

  let badgeBackground = "";
  if (timerStatus === TimerStatus.Playing) {
    if (targetMinutes === POMODORO_WORK_TIME) {
      badgeBackground = "primary";
    } else {
      badgeBackground = "success";
    }
  } else {
    badgeBackground = "secondary";
  }

  return (
    <div
      style={{
        display: "flex",
        margin: "0 100px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: "12px" }}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              margin: 0,
              padding: 0,
            }}
          >
            <Badge bg={badgeBackground}>
              {minutesDisplay}:{secondsDisplay}
            </Badge>
          </h3>
        </div>

        <ButtonGroup style={{ marginRight: "5px" }}>
          <Button variant="outline-secondary" onClick={onSetTargetToWork}>
            {POMODORO_WORK_TIME}
          </Button>
          <Button variant="outline-secondary" onClick={onSetTargetToBreak}>
            {POMODORO_BREAK_TIME}
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            variant="outline-secondary"
            onClick={onPlay}
            disabled={
              timerStatus === TimerStatus.Playing ||
              timerStatus === TimerStatus.Alarm
            }
          >
            <Play />
          </Button>
          <Button
            variant="outline-secondary"
            onClick={onPause}
            disabled={
              timerStatus === TimerStatus.Paused ||
              timerStatus === TimerStatus.Alarm ||
              timerStatus === TimerStatus.Stopped
            }
          >
            <Pause />
          </Button>
          <Button
            variant="outline-secondary"
            onClick={onStop}
            disabled={timerStatus === TimerStatus.Stopped}
          >
            <Stop />
          </Button>
        </ButtonGroup>
      </div>
      <audio className="audio-element" ref={audioRef}>
        <source src="https://assets.coderrocketfuel.com/pomodoro-times-up.mp3"></source>
      </audio>
    </div>
  );
}
