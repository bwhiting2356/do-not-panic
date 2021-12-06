import { Table } from "react-bootstrap";
import { useAppSelector } from "../../app/hooks";
import { selectTodosDueToday } from "../../features/todos/selectors";
import { convertMinutesToHours, sumTodoPomodoros } from "../../shared/util";
import {
  POMODORO_BREAK_TIME,
  POMODORO_WORK_TIME,
} from "../../shared/constants";

export function TotalToday() {
  const todayTodos = useAppSelector(selectTodosDueToday);
  const completeTodos = todayTodos.filter((todo) => todo.done);
  const totalCompletePoms = completeTodos.reduce(sumTodoPomodoros, 0);
  const pomodoroTotalTime = POMODORO_WORK_TIME + POMODORO_BREAK_TIME;
  const totalCompleteTime = totalCompletePoms * pomodoroTotalTime;
  const notCompleteTodos = todayTodos.filter((todo) => !todo.done);
  const totalNotCompletePoms = notCompleteTodos.reduce(sumTodoPomodoros, 0);
  const totalNotCompleteTime = totalNotCompletePoms * pomodoroTotalTime;

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
