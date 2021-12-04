import { createSelector } from "reselect";
import { RootState } from "../../app/store";

const selectSettingsState = (state: RootState) => state.settings;

export const selectPhoneNumber = createSelector(
  selectSettingsState,
  (state) => state.currentState.phoneNumber
);
