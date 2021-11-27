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
      currentState: prevState,
      futureState: [currentState, ...futureState],
      pastState: newPastState,
    };
  } else {
    return {
      currentState,
      futureState,
      pastState,
    };
  }
};

export const redo = <T>(state: StateWithHistory<T>) => {
  const { pastState, currentState, futureState } = state;
  const nextState = futureState[0] || currentState;
  const newFutureState = futureState.slice(1) || [];
  return {
    currentState: nextState,
    futureState: newFutureState,
    pastState: [...pastState, currentState],
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
    currentState: newState,
    futureState: [],
    pastState: newPastState,
  };
};
