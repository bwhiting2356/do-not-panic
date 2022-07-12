import React from "react";
import { ButtonToolbar } from "react-bootstrap";
import { Pie, Bar } from "react-chartjs-2";
import { ArrowButtons } from "./ArrowButtons";
import { PeriodButtons } from "./PeriodButtons";
import { ReportButtons } from "./ReportButtons";
import { useAppSelector } from "../../app/hooks";
import {
  selectPomsByDayChartDataStacked,
  selectPomsByProject,
  selectReport,
  selectTimePeriodDescription,
  selectTodosFilteredInArchive,
} from "../../features/analytics/selectors";
import { ReportType } from "../../shared/report-type";
import { TodoTable } from "../todos/TodoTable";
import { Due } from "../../shared/due.type";

const stackedChartOptions = {
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export function Archive() {
  const reportType = useAppSelector(selectReport);
  const stackedChartData = useAppSelector(selectPomsByDayChartDataStacked);
  const pieChartData = useAppSelector(selectPomsByProject);
  const timePeriodDescription = useAppSelector(selectTimePeriodDescription);
  const todosss = useAppSelector(selectTodosFilteredInArchive);

  const renderChart = () => {
    if (reportType === ReportType.PomsPerDay) {
      return <Bar data={stackedChartData} options={stackedChartOptions} />;
    } else {
      return <Pie data={pieChartData} />;
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <h1>Archived Todos Report: {timePeriodDescription}</h1>

      <ButtonToolbar aria-label="Toolbar with button groups">
        <ReportButtons />
        <PeriodButtons />
        <ArrowButtons />
      </ButtonToolbar>

      <div
        style={{
          margin: "auto",
          width: reportType === ReportType.PomsPerDay ? "100%" : "600px",
          marginTop: "20px",
        }}
      >
        {renderChart()}
      </div>
      <TodoTable todos={todosss} due={Due.Archived} />
    </div>
  );
}
