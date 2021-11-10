import React, { useState, useEffect, useCallback, useRef } from "react";
import { Badge, Button, ButtonGroup } from "react-bootstrap";
import { Pause, Play, Stop } from "react-bootstrap-icons";
import { POMODORO_WORK_TIME, SECONDS_PER_MINUTE } from "../shared/constants";
import { padZeros } from "../shared/util";

const defaultPomodoroSeconds = 10 // POMODORO_WORK_TIME * SECONDS_PER_MINUTE;

enum TimerState {
  Playing,
  Paused,
  Stopped,
  Alarm
}

export function PomodoroTimer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [seconds, setSeconds] = useState(defaultPomodoroSeconds);
  const [timerInterval, setTimerInterval] = useState(0);
  const [timerState, setTimerState] = useState<TimerState>(TimerState.Stopped);
  const minutesDisplay = padZeros(Math.floor(seconds / 60));
  const secondsDisplay = padZeros(seconds % 60);

  const stopSound = () => {
    if (audioRef?.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  }

  const playSound = () => audioRef?.current?.play();

  useEffect(() => {
    return () => window.clearInterval(timerInterval);
  }, [timerInterval]);

  useEffect(() => {
      if (seconds === 0) {
          setTimerState(TimerState.Alarm);
          playSound();
          window.clearInterval(timerInterval);
      }
  }, [seconds, timerInterval])

  const onPlay = () => {
    
    setTimerState(TimerState.Playing);
    setTimerInterval(
      window.setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000)
    );
  };
  const onPause = useCallback(() => {
    setTimerState(TimerState.Paused);
    window.clearInterval(timerInterval);
    setTimerInterval(0);
  }, [timerInterval]);

  const onStop = useCallback(() => {
    stopSound();
    setTimerState(TimerState.Stopped);
    window.clearInterval(timerInterval);
    setTimerInterval(0);
    setSeconds(defaultPomodoroSeconds);
  }, [timerInterval]);

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <h2>
          <Badge bg="secondary">
            {minutesDisplay}:{secondsDisplay}
          </Badge>
        </h2>
      </div>

      <ButtonGroup>
        <Button
          variant="outline-secondary"
          onClick={onPlay}
          disabled={timerState === TimerState.Playing || timerState === TimerState.Alarm}
        >
          <Play />
        </Button>
        <Button
          variant="outline-secondary"
          onClick={onPause}
          disabled={timerState === TimerState.Paused || timerState === TimerState.Alarm}
        >
          <Pause />
        </Button>
        <Button
          variant="outline-secondary"
          onClick={onStop}
          disabled={timerState === TimerState.Stopped}
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
