import { createSelector } from "reselect";
import { RootState } from "../../app/store";

const selectTimerState = (state: RootState) => state.timer;

export const selectSegments = createSelector(
  selectTimerState,
  (state) => state.segments
);

export const selectTimerStatus = createSelector(
  selectTimerState,
  (state) => state.timerStatus
);

export const selectTargetMinutes = createSelector(
  selectTimerState,
  (state) => state.targetMinutes
);
