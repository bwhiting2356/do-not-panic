import React, { useState, useEffect, useRef, useCallback } from "react";
import { Badge, Button, ButtonGroup } from "react-bootstrap";
import { Pause, Play, Stop } from "react-bootstrap-icons";
import { POMODORO_BREAK_TIME, POMODORO_WORK_TIME } from "../shared/constants";
import {
  computeSecondsRemaining,
  TimerSegment,
  TimerStatus,
  usePomodoroState,
} from "../shared/pomodoro-logic";
import { padZeros } from "../shared/util";

export function PomodoroTimer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [{ timerStatus, segments, targetMinutes }, setState] =
    usePomodoroState();
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
    if (newSecondsRemaining === 0) {
      setState((prev) => ({
        ...prev,
        timerStatus: TimerStatus.Alarm,
        segments: prev.segments,
      }));
      playSound();

      setTimeout(() => {
        setState((prev) => ({
          targetMinutes: prev.targetMinutes === POMODORO_WORK_TIME ? POMODORO_BREAK_TIME : POMODORO_WORK_TIME,
          timerStatus: TimerStatus.Stopped,
          segments: [],
        }));
      }, 2000)
    }
    setSecondsRemaining(newSecondsRemaining);
  }, [segments, setState, setSecondsRemaining, targetMinutes]);

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
      <div>
        <h2>
          <Badge
            bg={
              timerStatus === TimerStatus.Playing ||
              timerStatus === TimerStatus.Alarm
                ? "primary"
                : "secondary"
            }
          >
            {minutesDisplay}:{secondsDisplay}
          </Badge>
        </h2>
      </div>
      <div style={{ display: "flex" }}>
        <ButtonGroup style={{ marginRight: '5px'}}>
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
