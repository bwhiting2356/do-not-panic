import React from "react";

import { Pie } from "react-chartjs-2";
import { useAppSelector } from "../app/hooks";
import { selectArchivedTodos } from "../features/todos/selectors";
import { convertStringPoms } from "../shared/util";
export function ProjectAnalytics() {
  const archivedTodos = useAppSelector(selectArchivedTodos);

  const todoPomsByProject = archivedTodos.reduce(
    (acc, curr) => {
      const project = curr.project;
      if (project) {
        if (acc[project]) {
          acc[project] += convertStringPoms(curr.poms);
        } else {
          acc[project] = convertStringPoms(curr.poms);
        }
      } else {
        acc["No Project"] += convertStringPoms(curr.poms);
      }
      return acc;
    },
    { "No Project": 0 } as Record<string, number>
  );

  let labels: string[] = [];
  let data: number[] = [];

  Object.keys(todoPomsByProject).forEach((key) => {
    labels.push(key);
    data.push(todoPomsByProject[key]);
  }); // TODO: maybe this can be refactored differently

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: ["red", "blue", "pink", "orange", "green", "purple"],
      },
    ],
  };
  return (
    <div style={{ width: "450px" }}>
      <Pie data={chartData} />
    </div>
  );
}
