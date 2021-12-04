import { createSelector } from "reselect";
import { RootState } from "../../app/store";

const selectSettingsState = (state: RootState) => state.settings;

export const selectPhoneNumber = createSelector(
  selectSettingsState,
  (state) => state.currentState.phoneNumber
);

export const selectPomodoroWorkTime = createSelector(
  selectSettingsState,
  (state) => parseInt(state.currentState.pomodoroWorkTime)
);

export const selectPomodoroBreakTime = createSelector(
  selectSettingsState,
  (state) => parseInt(state.currentState.pomodoroBreakTime)
);
