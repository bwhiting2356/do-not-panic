import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  StateWithHistory,
  addNewStateGoingForward,
  redo,
  undo,
} from "../shared";

interface SettingsState {
  phoneNumber: string;
}

export type TemplateStateWithHistory = StateWithHistory<SettingsState>;

const initialCurrentState: SettingsState = {
  phoneNumber: "",
};

const initialState: TemplateStateWithHistory = {
  currentState: initialCurrentState,
  futureState: [],
  pastState: [],
};

export const settingsSlice = createSlice({
  initialState,
  name: "settings",

  reducers: {
    editPhoneNumber: (state, action: PayloadAction<string>) => {
      return addNewStateGoingForward(state, {
        ...state.currentState,
        phoneNumber: action.payload,
      });
    },
    redoSettings: redo,
    undoSettings: undo,
  },
});

export const { editPhoneNumber, redoSettings, undoSettings } =
  settingsSlice.actions;

export default settingsSlice.reducer;
