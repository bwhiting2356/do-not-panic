import React from "react";

import { Pie } from "react-chartjs-2";
import { useAppSelector } from "../app/hooks";
import { selectArchivedTodos } from "../features/todos/selectors";
import { computeChartData } from "../shared/util";

export function ProjectAnalytics() {
  const archivedTodos = useAppSelector(selectArchivedTodos);
  return (
    <div style={{ width: "450px" }}>
      <Pie data={computeChartData(archivedTodos)} />
    </div>
  );
}
