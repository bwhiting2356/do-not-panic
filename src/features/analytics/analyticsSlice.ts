/* eslint-disable no-console */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Period } from "../../shared/period";
import { ReportType } from "../../shared/report-type";
import {
  StateWithHistory,
  addNewStateGoingForward,
  redo,
  undo,
} from "../shared";

interface AnalyticsState {
  period: Period;
  currentWeekIndex: number;
  currentMonthIndex: number;
  currentQuarterIndex: number;
  report: ReportType;
}

export type AnalyticsStateWithHistory = StateWithHistory<AnalyticsState>;

const initialCurrentState: AnalyticsState = {
  period: Period.Weekly,
  currentWeekIndex: 0,
  currentMonthIndex: 0,
  currentQuarterIndex: 0,
  report: ReportType.PomsPerProject,
};

const initialState: AnalyticsStateWithHistory = {
  currentState: initialCurrentState,
  futureState: [],
  pastState: [],
};

export const analyticsSlice = createSlice({
  initialState,
  name: "analytics",
  reducers: {
    redoAnalytics: redo,
    undoAnalytics: undo,
    editPeriod: (state, action: PayloadAction<Period>) => {
      return addNewStateGoingForward(state, {
        ...state.currentState,
        period: action.payload,
      });
    },
    editReport: (state, action: PayloadAction<ReportType>) => {
      return addNewStateGoingForward(state, {
        ...state.currentState,
        report: action.payload,
      });
    },
    editCurrentWeekIndex: (state, action: PayloadAction<number>) => {
      return addNewStateGoingForward(state, {
        ...state.currentState,
        currentWeekIndex: action.payload,
      });
    },
    editCurrentMonthIndex: (state, action: PayloadAction<number>) => {
      return addNewStateGoingForward(state, {
        ...state.currentState,
        currentMonthIndex: action.payload,
      });
    },
    editCurrentQuarterIndex: (state, action: PayloadAction<number>) => {
      return addNewStateGoingForward(state, {
        ...state.currentState,
        currentQuarterIndex: action.payload,
      });
    },
  },
});

export const {
  undoAnalytics,
  redoAnalytics,
  editPeriod,
  editReport,
  editCurrentWeekIndex,
  editCurrentMonthIndex,
  editCurrentQuarterIndex,
} = analyticsSlice.actions;
export default analyticsSlice.reducer;
