import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { POMODORO_WORK_TIME } from "../../shared/constants";
import { computeSecondsRemaining } from "../../shared/pomodoro-helpers";

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

interface TimerState {
  segments: TimerSegment[];
  targetMinutes: number;
  timerStatus: TimerStatus;
  secondsRemaining: number;
}

const initialState: TimerState = {
  segments: [],
  targetMinutes: POMODORO_WORK_TIME,
  timerStatus: TimerStatus.Stopped,
  secondsRemaining: 0,
};

export const timerSlice = createSlice({
  initialState,
  name: "timer",
  reducers: {
    editTimerStatus: (state, action: PayloadAction<TimerStatus>) => {
      return { ...state, timerStatus: action.payload };
    },
    editTargetMinutes: (state, action: PayloadAction<number>) => {
      return { ...state, targetMinutes: action.payload };
    },
    onPlayTimer: (state) => {
      const newSegments: TimerSegment[] = [
        ...state.segments,
        { startTime: new Date() },
      ];
      return {
        ...state,
        segments: newSegments,
        timerStatus: TimerStatus.Playing,
        secondsRemaining: computeSecondsRemaining(
          newSegments,
          state.targetMinutes
        ),
      };
    },
    onPauseTimer: (state) => {
      const segmentsCopy = [...state.segments];
      segmentsCopy[segmentsCopy.length - 1] = {
        ...segmentsCopy[segmentsCopy.length - 1],
        endTime: new Date(),
      };

      return {
        ...state,
        segments: segmentsCopy,
        timerStatus: TimerStatus.Paused,
        secondsRemaining: computeSecondsRemaining(
          segmentsCopy,
          state.targetMinutes
        ),
      };
    },
    onStopTimer: (state) => {
      const newSegments: TimerSegment[] = [];
      return {
        ...state,
        segments: newSegments,
        timerStatus: TimerStatus.Stopped,
        secondsRemaining: computeSecondsRemaining(
          newSegments,
          state.targetMinutes
        ),
      };
    },
    clearSegments: (state) => {
      return { ...state, segments: [] };
    },
    updateSecondsRemaining: (state) => {
      return {
        ...state,
        secondsRemaining: computeSecondsRemaining(
          state.segments,
          state.targetMinutes
        ),
      };
    },
  },
});

export const {
  editTimerStatus,
  editTargetMinutes,
  onPlayTimer,
  onPauseTimer,
  onStopTimer,
  clearSegments,
  updateSecondsRemaining,
} = timerSlice.actions;

export default timerSlice.reducer;
