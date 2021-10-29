import React from "react";

import { Pie } from "react-chartjs-2";
import { useAppSelector } from "../app/hooks";
import { selectArchivedTodos } from "../features/todos/selectors";
import { Project } from "../shared/project.enum";
import { sumTodoPomodoros } from "../shared/util";
export function ProjectAnalytics() {
  const archivedTodos = useAppSelector(selectArchivedTodos);

  const totalArchivedMisc = archivedTodos
    .filter((todo) => todo.project === Project.Misc)
    .reduce(sumTodoPomodoros, 0);

  const totalArchivedMotto = archivedTodos
    .filter((todo) => todo.project === Project.Motto)
    .reduce(sumTodoPomodoros, 0);

  const totalArchivedOnCall = archivedTodos
    .filter((todo) => todo.project === Project.OnCall)
    .reduce(sumTodoPomodoros, 0);

  const totalArchivedReQa = archivedTodos
    .filter((todo) => todo.project === Project.ReQa)
    .reduce(sumTodoPomodoros, 0);

  const totalArchivedTfx = archivedTodos
    .filter((todo) => todo.project === Project.Tfx)
    .reduce(sumTodoPomodoros, 0);

  const totalArchivedNoProject = archivedTodos
    .filter((todo) => !Boolean(todo.project))
    .reduce(sumTodoPomodoros, 0);

  const chartData = {
    labels: [
      Project.Misc,
      Project.Motto,
      Project.OnCall,
      Project.ReQa,
      Project.Tfx,
      "No Project",
    ],
    datasets: [
      {
        data: [
          totalArchivedMisc,
          totalArchivedMotto,
          totalArchivedOnCall,
          totalArchivedReQa,
          totalArchivedTfx,
          totalArchivedNoProject,
        ],
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
