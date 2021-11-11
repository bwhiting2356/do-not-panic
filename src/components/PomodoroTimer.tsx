import React, { useState, useEffect, useRef, useCallback } from "react";
import { Badge, Button, ButtonGroup } from "react-bootstrap";
import { Pause, Play, Stop } from "react-bootstrap-icons";
import {
  computeSecondsRemaining,
  TimerSegment,
  TimerStatus,
  usePomodoroState,
} from "../shared/pomodoro-logic";
import { padZeros } from "../shared/util";

export function PomodoroTimer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [{ timerStatus, segments }, setState] = usePomodoroState();
  const [interval, setInterval] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState(
    computeSecondsRemaining(segments)
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
    const newSecondsRemaining = computeSecondsRemaining(segments);
    if (newSecondsRemaining === 0) {
      setState((prev) => ({
        timerStatus: TimerStatus.Alarm,
        segments: prev.segments,
      }));
      playSound();
    }
    setSecondsRemaining(newSecondsRemaining);
  }, [segments, setState, setSecondsRemaining]);

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
  }, [timerStatus]);

  useEffect(() => {
    const listenForStopAlarm = (event: KeyboardEvent) => {
      if (timerStatus === TimerStatus.Alarm) {
        onStop();
      }
    };
    window.addEventListener("keydown", listenForStopAlarm);
    return () => window.removeEventListener("keydown", listenForStopAlarm);
  });

  const onPlay = () => {
    setState((prev) => {
      const newSegments: TimerSegment[] = [
        ...prev.segments,
        { startTime: new Date() },
      ];
      return {
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
        timerStatus: TimerStatus.Paused,
        segments: segmentsCopy,
      };
    });
  };

  const onStop = () => {
    stopSound();
    setState({
      timerStatus: TimerStatus.Stopped,
      segments: [],
    });
  };

  return (
    <div
      style={{
        display: "flex",
        margin: "0 200px",
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
            timerStatus === TimerStatus.Alarm
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
      <audio className="audio-element" ref={audioRef} loop>
        <source src="https://assets.coderrocketfuel.com/pomodoro-times-up.mp3"></source>
      </audio>
    </div>
  );
}
