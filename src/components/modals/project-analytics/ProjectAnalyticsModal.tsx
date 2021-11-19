import React, { useState } from "react";
import { Modal, Tab, Tabs } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { useAppSelector } from "../../../app/hooks";
import { useAppContext } from "../../../context/context";
import { selectArchivedTodos } from "../../../features/todos/selectors";
import { computeChartData, groupTodosByTimeDisplayBuckets } from "../../../shared/util";
import { ArrowButtons } from "./ArrowButtons";

type TimeBucketType = 'weekly' | 'monthly';

interface ProjectModalState {
  key: TimeBucketType,
  currentWeekIndex: number;
  currentMonthIndex: number;
}

export const calculateDisabledArrows = ({ 
  key, 
  currentMonthIndex, 
  currentWeekIndex }: ProjectModalState, 
  totalWeeks: number, 
  totalMonths: number) => {
  let disabledLeft = true;
  let disabledRight = true;
  if (key === 'weekly') {
    if (currentWeekIndex !== 0) {
      disabledLeft = false;
    } else if (currentWeekIndex !== totalWeeks - 1) {
      disabledRight = false;
    }
  } else {
    if (currentMonthIndex !== 0) {
      disabledLeft = false;
    } else if (currentMonthIndex !== totalMonths - 1) {
      disabledRight = false;
    }

  }
  return { disabledLeft, disabledRight }
}

export function ProjectAnalyticsModal() {
    const { showProjectAnalytics, setShowProjectAnalytics } = useAppContext();
    const archivedTodos = useAppSelector(selectArchivedTodos);

    const todosByTimeBucket = groupTodosByTimeDisplayBuckets(archivedTodos);
    const totalWeeks = todosByTimeBucket.weekly.length;
    const totalMonths = todosByTimeBucket.monthly.length;

    const [state, setState] = useState<ProjectModalState>({
      key: 'weekly',
      currentWeekIndex: totalWeeks - 1,
      currentMonthIndex: totalMonths - 1
    })
    const { key, currentWeekIndex, currentMonthIndex  } = state;

    const { disabledLeft, disabledRight } = calculateDisabledArrows(state, totalWeeks, totalMonths);

    const onLeftArrow = () => {  
      if (key === 'weekly') {
        setState(prev => ({ ...prev, currentWeekIndex: prev.currentWeekIndex - 1 }))
      } else {
        setState(prev => ({ ...prev, currentMonthIndex: prev.currentMonthIndex - 1 }))
      }
    }

    const onRightArrow = () => {
      if (key === 'weekly') {
        setState(prev => ({ ...prev, currentWeekIndex: prev.currentWeekIndex + 1 }))
      } else {
        setState(prev => ({ ...prev, currentMonthIndex: prev.currentMonthIndex + 1 }))
      }
    }

    const onSetKey = (key: string | null) => {
      setState(state => ({ ...state, key: key as TimeBucketType || 'weekly' }))
    }
    const { timeDisplay: weekDisplay, todos: weeklyTodos } = todosByTimeBucket.weekly[currentWeekIndex];
    const weeklyChartData = computeChartData(weeklyTodos);

    const { timeDisplay: monthDisplay, todos: monthlyTodos } = todosByTimeBucket.monthly[currentMonthIndex];
    const monthlyChartData = computeChartData(monthlyTodos);

    return (
      <Modal
        show={showProjectAnalytics}
        onHide={() => setShowProjectAnalytics(!showProjectAnalytics)}
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
            onRightArrow={onRightArrow} />
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
