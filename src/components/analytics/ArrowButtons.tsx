import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  editCurrentMonthIndex,
  editCurrentQuarterIndex,
  editCurrentWeekIndex,
} from "../../features/analytics/analyticsSlice";
import {
  selectCurrentQuarterIndex,
  selectCurrentMonthIndex,
  selectCurrentWeekIndex,
  selectDisabledArrows,
  selectPeriod,
} from "../../features/analytics/selectors";
import { Period } from "../../shared/period";

export function ArrowButtons() {
  const period = useAppSelector(selectPeriod);
  const currentWeekIndex = useAppSelector(selectCurrentWeekIndex);
  const currentMonthIndex = useAppSelector(selectCurrentMonthIndex);
  const currentQuarterIndex = useAppSelector(selectCurrentQuarterIndex);
  const { disabledLeft, disabledRight } = useAppSelector(selectDisabledArrows);
  const dispatch = useAppDispatch();

  // maybe put this in the reducer
  const onLeftArrow = () => {
    if (period === Period.Weekly) {
      dispatch(editCurrentWeekIndex(currentWeekIndex - 1));
    } else if (period === Period.Monthly) {
      dispatch(editCurrentMonthIndex(currentMonthIndex - 1));
    } else {
      dispatch(editCurrentQuarterIndex(currentQuarterIndex - 1));
    }
  };

  const onRightArrow = () => {
    if (period === Period.Weekly) {
      dispatch(editCurrentWeekIndex(currentWeekIndex + 1));
    } else if (period === Period.Monthly) {
      dispatch(editCurrentMonthIndex(currentMonthIndex + 1));
    } else {
      dispatch(editCurrentQuarterIndex(currentQuarterIndex + 1));
    }
  };

  return (
    <ButtonGroup>
      <Button
        onClick={onLeftArrow}
        disabled={disabledLeft}
        size="sm"
        variant="outline-secondary"
      >
        <ArrowLeft />
      </Button>
      <Button
        onClick={onRightArrow}
        disabled={disabledRight}
        size="sm"
        variant="outline-secondary"
      >
        <ArrowRight />
      </Button>
    </ButtonGroup>
  );
}
