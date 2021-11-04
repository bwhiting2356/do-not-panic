import React from "react";
import { Table } from "react-bootstrap";
import { useAppSelector } from "../app/hooks";
import { selectTodosDueToday } from "../features/todos/selectors";
import { POMODORO_TOTAL_TIME } from "../shared/constants";
import { convertMinutesToHours, sumTodoPomodoros } from "../shared/util";

export function TodalToday() {
  const todayTodos = useAppSelector(selectTodosDueToday);

  const completeTodos = todayTodos.filter((todo) => todo.done);
  const totalCompletePoms = completeTodos.reduce(sumTodoPomodoros, 0);
  const totalCompleteTime = totalCompletePoms * POMODORO_TOTAL_TIME;
  const notCompleteTodos = todayTodos.filter((todo) => !todo.done);
  const totalNotCompletePoms = notCompleteTodos.reduce(sumTodoPomodoros, 0);
  const totalNotCompleteTime = totalNotCompletePoms * POMODORO_TOTAL_TIME;

  return (
    <Table
      style={{ textAlign: "right", width: "300px", marginTop: "10px" }}
      striped
      bordered
      hover
      size="sm"
    >
      <thead>
        <tr>
          <th>Today</th>
          <th>Poms</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Total complete:</td>
          <td>{totalCompletePoms}</td>
          <td>{convertMinutesToHours(totalCompleteTime)}</td>
        </tr>
        <tr>
          <td>Total remaining:</td>
          <td>{totalNotCompletePoms}</td>
          <td>{convertMinutesToHours(totalNotCompleteTime)}</td>
        </tr>
      </tbody>
    </Table>
  );
}
