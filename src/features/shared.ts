import { MAX_TODO_HISTORY } from "../shared/constants";

export interface StateWithHistory<T> {
  pastState: T[];
  currentState: T;
  futureState: T[];
}

export const undo = <T>(state: StateWithHistory<T>) => {
  const { pastState, currentState, futureState } = state;
  const prevState = pastState[pastState.length - 1];
  const newPastState = pastState.slice(0, pastState.length - 1);

  if (prevState) {
    return {
      pastState: newPastState,
      currentState: prevState,
      futureState: [currentState, ...futureState],
    };
  } else {
    return {
      pastState,
      currentState,
      futureState,
    };
  }
};

export const redo = <T>(state: StateWithHistory<T>) => {
  const { pastState, currentState, futureState } = state;
  const nextState = futureState[0] || currentState;
  const newFutureState = futureState.slice(1) || [];
  return {
    pastState: [...pastState, currentState],
    currentState: nextState,
    futureState: newFutureState,
  };
};

export const addNewStateGoingForward = <T>(
  prevState: StateWithHistory<T>,
  newState: T
): StateWithHistory<T> => {
  const newPastState = [
    ...(prevState.pastState || []),
    prevState.currentState,
  ].slice(MAX_TODO_HISTORY * -1);
  return {
    pastState: newPastState,
    currentState: newState,
    futureState: [],
  };
};
