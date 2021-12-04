import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { POMODORO_WORK_TIME } from "../../shared/constants";

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
}

const initialState: TimerState = {
  segments: [],
  targetMinutes: POMODORO_WORK_TIME,
  timerStatus: TimerStatus.Stopped,
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
      };
    },
    onStopTimer: (state) => {
      return {
        ...state,
        segments: [],
        timerStatus: TimerStatus.Stopped,
      };
    },
    clearSegments: (state) => {
      return { ...state, segments: [] };
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
} = timerSlice.actions;

export default timerSlice.reducer;
