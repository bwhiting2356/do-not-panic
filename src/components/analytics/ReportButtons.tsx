import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { BarChart, PieChart } from "react-bootstrap-icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { editReport } from "../../features/analytics/analyticsSlice";
import { selectReport } from "../../features/analytics/selectors";
import { ReportType } from "../../shared/report-type";

export function ReportButtons() {
  const report = useAppSelector(selectReport);
  const dispatch = useAppDispatch();

  const onSetReport = (newReport: ReportType) => {
    dispatch(editReport(newReport));
  };
  return (
    <ButtonGroup className="me-2" aria-label="First group">
      <Button
        variant={
          report === ReportType.PomsPerDay ? "primary" : "outline-primary"
        }
        onClick={() => onSetReport(ReportType.PomsPerDay)}
      >
        <BarChart style={{ marginRight: "10px" }} />
        Poms per day
      </Button>
      <Button
        variant={
          report === ReportType.PomsPerProject ? "primary" : "outline-primary"
        }
        onClick={() => onSetReport(ReportType.PomsPerProject)}
      >
        <PieChart style={{ marginRight: "10px" }} />
        Poms per project
      </Button>
    </ButtonGroup>
  );
}
