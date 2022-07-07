import React, { useState } from "react";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { Pie, Line } from "react-chartjs-2";
import { ArrowButtons } from "./ArrowButtons";
import {
  ProjectAnalyticsState,
  aggregatePomsByProjectChartData,
  calculateDisabledArrows,
  groupTodosByTimeDisplayBuckets,
  Period,
  ReportType,
  aggregatePomsByDayChartData,
} from "./helpers";
import { useAppSelector } from "../../app/hooks";
import { selectProjects } from "../../features/projects/selectors";
import { selectArchivedTodos } from "../../features/todos/selectors";
import { Todo } from "../../shared/todo";

export function Analytics() {
  const archivedTodos = useAppSelector(selectArchivedTodos);
  const projects = useAppSelector(selectProjects);

  const todosByTimeBucket = groupTodosByTimeDisplayBuckets(archivedTodos);
  const totalWeeks = todosByTimeBucket.weekly.length;
  const totalMonths = todosByTimeBucket.monthly.length;

  const [state, setState] = useState<ProjectAnalyticsState>({
    currentMonthIndex: totalMonths - 1,
    currentWeekIndex: totalWeeks - 1,
    period: Period.Weekly,
    report: ReportType.PomsPerDay,
  });
  const { period, report, currentWeekIndex, currentMonthIndex } = state;

  const { timeDisplay: weekDisplay = "", todos: weeklyTodos = [] } =
    todosByTimeBucket.weekly[currentWeekIndex] || {};

  const { timeDisplay: monthDisplay = "", todos: monthlyTodos = [] } =
    todosByTimeBucket.monthly[currentMonthIndex] || {};

  const { disabledLeft, disabledRight } = calculateDisabledArrows(
    state,
    totalWeeks,
    totalMonths
  );

  const onLeftArrow = () => {
    if (period === Period.Weekly) {
      setState((prev) => ({
        ...prev,
        currentWeekIndex: prev.currentWeekIndex - 1,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        currentMonthIndex: prev.currentMonthIndex - 1,
      }));
    }
  };

  const onRightArrow = () => {
    if (period === Period.Weekly) {
      setState((prev) => ({
        ...prev,
        currentWeekIndex: prev.currentWeekIndex + 1,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        currentMonthIndex: prev.currentMonthIndex + 1,
      }));
    }
  };

  const onSetPeriod = (newPeriod: Period) => {
    setState((prevState) => ({
      ...prevState,
      period: newPeriod || Period.Weekly,
    }));
  };

  const onSetReport = (newReport: ReportType) => {
    setState((prevState) => ({
      ...prevState,
      report: newReport || ReportType.PomsPerDay,
    }));
  };

  const renderChart = () => {
    let todos: Todo[] = [];
    if (period === Period.Weekly) {
      todos = weeklyTodos;
    } else if (period === Period.Monthly) {
      todos = monthlyTodos;
    }
    if (report === ReportType.PomsPerDay) {
      const lineChartData = aggregatePomsByDayChartData(todos);
      return <Line data={lineChartData} />;
    } else if (report === ReportType.PomsPerProject) {
      const chartData = aggregatePomsByProjectChartData(todos, projects);
      return <Pie data={chartData} />;
    }
  };

  const generateTimePeriodDescription = () => {
    if (period === Period.Weekly) {
      return weekDisplay;
    } else if (period === Period.Monthly) {
      return monthDisplay;
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <h1>Archived Todos Report: {generateTimePeriodDescription()}</h1>

      <ButtonToolbar aria-label="Toolbar with button groups">
        <ButtonGroup className="me-2" aria-label="First group">
          <Button
            variant={
              report === ReportType.PomsPerDay ? "primary" : "outline-primary"
            }
            onClick={() => onSetReport(ReportType.PomsPerDay)}
          >
            Poms per day
          </Button>
          <Button
            variant={
              report === ReportType.PomsPerProject
                ? "primary"
                : "outline-primary"
            }
            onClick={() => onSetReport(ReportType.PomsPerProject)}
          >
            Poms per project
          </Button>
        </ButtonGroup>
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
        </ButtonGroup>
        <ButtonGroup aria-label="Third group">
          <ArrowButtons
            disabledLeft={disabledLeft}
            disabledRight={disabledRight}
            onLeftArrow={onLeftArrow}
            onRightArrow={onRightArrow}
          />
        </ButtonGroup>
      </ButtonToolbar>

      <div style={{ margin: "auto", width: "600px", marginTop: "20px" }}>
        {renderChart()}
      </div>
    </div>
  );
}
