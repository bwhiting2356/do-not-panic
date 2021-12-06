import React, { useState } from "react";
import { Modal, Tab, Tabs } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { ArrowButtons } from "./ArrowButtons";
import {
  ProjectModalState,
  TimeBucketType,
  aggregateChartData,
  calculateDisabledArrows,
  groupTodosByTimeDisplayBuckets,
} from "./helpers";
import { useAppSelector } from "../../../app/hooks";
import { useAppContext } from "../../../context/context";
import { selectProjects } from "../../../features/projects/selectors";
import { selectArchivedTodos } from "../../../features/todos/selectors";

export function ProjectAnalyticsModal() {
  const { setActiveModal } = useAppContext();
  const archivedTodos = useAppSelector(selectArchivedTodos);
  const projects = useAppSelector(selectProjects);

  const todosByTimeBucket = groupTodosByTimeDisplayBuckets(archivedTodos);
  const totalWeeks = todosByTimeBucket.weekly.length;
  const totalMonths = todosByTimeBucket.monthly.length;

  const [state, setState] = useState<ProjectModalState>({
    currentMonthIndex: totalMonths - 1,
    currentWeekIndex: totalWeeks - 1,
    key: "weekly",
  });
  const { key, currentWeekIndex, currentMonthIndex } = state;

  const { timeDisplay: weekDisplay = "", todos: weeklyTodos = [] } =
    todosByTimeBucket.weekly[currentWeekIndex] || {};
  const weeklyChartData = aggregateChartData(weeklyTodos, projects);

  const { timeDisplay: monthDisplay = "", todos: monthlyTodos = [] } =
    todosByTimeBucket.monthly[currentMonthIndex] || {};
  const monthlyChartData = aggregateChartData(monthlyTodos, projects);

  const { disabledLeft, disabledRight } = calculateDisabledArrows(
    state,
    totalWeeks,
    totalMonths
  );

  const onLeftArrow = () => {
    if (key === "weekly") {
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
    if (key === "weekly") {
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

  const onSetKey = (newKey: string | null) => {
    setState((prevState) => ({
      ...prevState,
      key: (newKey as TimeBucketType) || "weekly",
    }));
  };

  return (
    <Modal
      show={true}
      onHide={() => setActiveModal("")}
      style={{ textAlign: "center" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Archived Todo Total Poms by Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ArrowButtons
          disabledLeft={disabledLeft}
          disabledRight={disabledRight}
          onLeftArrow={onLeftArrow}
          onRightArrow={onRightArrow}
        />
        <Tabs activeKey={key} onSelect={onSetKey} className="mb-3">
          <Tab eventKey="weekly" title="Weekly">
            <h5>{weekDisplay}</h5>
            <Pie data={weeklyChartData} />
          </Tab>
          <Tab eventKey="monthly" title="Monthly">
            <h5>{monthDisplay}</h5>
            <Pie data={monthlyChartData} />
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}
