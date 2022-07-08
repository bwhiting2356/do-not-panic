import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { editPeriod } from "../../features/analytics/analyticsSlice";
import { selectPeriod } from "../../features/analytics/selectors";
import { Period } from "../../shared/period";

export function PeriodButtons() {
  const period = useAppSelector(selectPeriod);
  const dispatch = useAppDispatch();

  const onSetPeriod = (newPeriod: Period) => {
    dispatch(editPeriod(newPeriod));
  };
  return (
    <ButtonGroup className="me-2" aria-label="Second group">
      <Button
        variant={period === Period.Weekly ? "primary" : "outline-primary"}
        onClick={() => onSetPeriod(Period.Weekly)}
      >
        Weekly
      </Button>
      <Button
        variant={period === Period.Monthly ? "primary" : "outline-primary"}
        onClick={() => onSetPeriod(Period.Monthly)}
      >
        Monthly
      </Button>
      <Button
        variant={period === Period.Quarterly ? "primary" : "outline-primary"}
        onClick={() => onSetPeriod(Period.Quarterly)}
      >
        Quarterly
      </Button>
    </ButtonGroup>
  );
}
