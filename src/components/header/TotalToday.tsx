import { Table } from "react-bootstrap";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectTodosDueToday } from "../../features/todos/selectors";
import { convertMinutesToHours, sumTodoPomodoros } from "../../shared/util";
import { selectPomodoroWorkTime } from "../../features/settings/selectors";

export function TotalToday() {
  const todayTodos = useAppSelector(selectTodosDueToday);
  const pomodoroWorkTime = useAppSelector(selectPomodoroWorkTime);
  const completeTodos = todayTodos.filter((todo) => todo.done);
  const totalCompletePoms = completeTodos.reduce(sumTodoPomodoros, 0);
  const totalCompleteTime = totalCompletePoms * pomodoroWorkTime;
  const notCompleteTodos = todayTodos.filter((todo) => !todo.done);
  const totalNotCompletePoms = notCompleteTodos.reduce(sumTodoPomodoros, 0);
  const totalNotCompleteTime = totalNotCompletePoms * pomodoroWorkTime;

  return (
    <Table
      style={{
        marginTop: "10px",
        minWidth: "300px",
        textAlign: "right",
        width: "300px",
      }}
      striped
      bordered
      size="sm"
    >
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
