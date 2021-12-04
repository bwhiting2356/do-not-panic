import { useRef } from "react";
import { Badge, Button, ButtonGroup } from "react-bootstrap";
import { Pause, Play, Stop } from "react-bootstrap-icons";
import { getBadgeBackgroundClass, usePomodoroLogic } from "./usePomodoroLogic";
import {
  POMODORO_BREAK_TIME,
  POMODORO_WORK_TIME,
} from "../../shared/constants";
import { TimerStatus } from "../../features/timer/timerSlice";
export function PomodoroTimer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    timeDisplay,
    timerStatus,
    onPlay,
    onPause,
    onStop,
    onSetTargetToWork,
    onSetTargetToBreak,
    targetMinutes,
  } = usePomodoroLogic(audioRef);

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ alignItems: "center", display: "flex" }}>
        <div style={{ marginRight: "12px" }}>
          <h3
            style={{
              alignItems: "center",
              display: "flex",
              margin: 0,
              padding: 0,
            }}
          >
            <Badge
              className={getBadgeBackgroundClass(timerStatus, targetMinutes)}
            >
              {timeDisplay}
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
