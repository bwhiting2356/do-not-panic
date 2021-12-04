import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  POMODORO_BREAK_TIME,
  POMODORO_WORK_TIME,
} from "../../shared/constants";
import {
  StateWithHistory,
  addNewStateGoingForward,
  redo,
  undo,
} from "../shared";

interface SettingsState {
  phoneNumber: string;
  pomodoroWorkTime: string;
  pomodoroBreakTime: string;
}

export type SettingsStateWithHistory = StateWithHistory<SettingsState>;

const initialCurrentState: SettingsState = {
  phoneNumber: "",
  pomodoroWorkTime: POMODORO_WORK_TIME.toString(),
  pomodoroBreakTime: POMODORO_BREAK_TIME.toString(),
};

export const initialSettingsState: SettingsStateWithHistory = {
  currentState: initialCurrentState,
  futureState: [],
  pastState: [],
};

export const settingsSlice = createSlice({
  initialState: initialSettingsState,
  name: "settings",

  reducers: {
    editPhoneNumber: (state, action: PayloadAction<string>) => {
      return addNewStateGoingForward(state, {
        ...state.currentState,
        phoneNumber: action.payload,
      });
    },
    editPomodoroWorkTime: (state, action: PayloadAction<string>) => {
      return addNewStateGoingForward(state, {
        ...state.currentState,
        pomodoroWorkTime: action.payload,
      });
    },
    editPomodoroBreakTime: (state, action: PayloadAction<string>) => {
      return addNewStateGoingForward(state, {
        ...state.currentState,
        pomodoroBreakTime: action.payload,
      });
    },
    redoSettings: redo,
    undoSettings: undo,
  },
});

export const {
  editPhoneNumber,
  editPomodoroWorkTime,
  editPomodoroBreakTime,
  redoSettings,
  undoSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
