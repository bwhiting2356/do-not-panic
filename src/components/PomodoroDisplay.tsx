import { Badge, Button, ButtonGroup } from "react-bootstrap";
import { Pause, Play, Stop } from "react-bootstrap-icons";
import { useAppSelector } from "../app/hooks";
import {
  selectPomodoroBreakTime,
  selectPomodoroWorkTime,
} from "../features/settings/selectors";
import {
  selectSecondsRemaining,
  selectTargetMinutes,
  selectTimerStatus,
} from "../features/timer/selectors";
import { TimerStatus } from "../features/timer/timerSlice";
import { useAppContext } from "../context/context";
import {
  createTimeDisplay,
  getBadgeBackgroundClass,
} from "../shared/pomodoro-helpers";

export function PomodoroDisplay() {
  const pomodoroWorkMinutes = useAppSelector(selectPomodoroWorkTime);
  const pomodoroBreakMinutes = useAppSelector(selectPomodoroBreakTime);
  const timerStatus = useAppSelector(selectTimerStatus);
  const targetMinutes = useAppSelector(selectTargetMinutes);
  const secondsRemaining = useAppSelector(selectSecondsRemaining);
  const timeDisplay = createTimeDisplay(secondsRemaining);

  const { onSetTargetToWork, onSetTargetToBreak, onPlay, onPause, onStop } =
    useAppContext();
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
              className={getBadgeBackgroundClass(
                timerStatus,
                targetMinutes,
                pomodoroWorkMinutes
              )}
            >
              {timeDisplay}
            </Badge>
          </h3>
        </div>
        <ButtonGroup style={{ marginRight: "5px" }}>
          <Button variant="outline-secondary" onClick={onSetTargetToWork}>
            {pomodoroWorkMinutes}
          </Button>
          <Button variant="outline-secondary" onClick={onSetTargetToBreak}>
            {pomodoroBreakMinutes}
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
    </div>
  );
}
