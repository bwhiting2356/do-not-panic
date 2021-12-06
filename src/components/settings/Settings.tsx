import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectPhoneNumber,
  selectPomodoroBreakTime,
  selectPomodoroWorkTime,
} from "../../features/settings/selectors";
import {
  editPhoneNumber,
  editPomodoroBreakTime,
  editPomodoroWorkTime,
} from "../../features/settings/settingsSlice";
import { TextField } from "../TextField";

function Settings() {
  const dispatch = useAppDispatch();
  const phoneNumber = useAppSelector(selectPhoneNumber);
  const pomodoroWorkTime = useAppSelector(selectPomodoroWorkTime);
  const pomodoroBreakTime = useAppSelector(selectPomodoroBreakTime);
  const keepEditingIfNoPhoneNumber = () => {
    if (!phoneNumber) return true;
    return false;
  };
  const [editing, setEditing] = useState(keepEditingIfNoPhoneNumber);

  const onEditPhoneNumber = (newName: string) =>
    dispatch(editPhoneNumber(newName));

  const onEditWorkMinutes = (newMinutes: string) => {
    dispatch(editPomodoroWorkTime(newMinutes || "0"));
  };

  const onEditBreakMinutes = (newMinutes: string) => {
    dispatch(editPomodoroBreakTime(newMinutes || "0"));
  };

  return (
    <div style={{ width: "600px" }}>
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td>Phone number</td>
            <td>
              <span onClick={() => setEditing(true)}>
                <TextField
                  editing={editing}
                  text={phoneNumber}
                  onEditText={onEditPhoneNumber}
                  onSubmit={() => setEditing(keepEditingIfNoPhoneNumber())}
                  onBlur={() => setEditing(keepEditingIfNoPhoneNumber())}
                  placeholder="Enter your phone number"
                />
              </span>
            </td>
          </tr>
          <tr>
            <td>Pomodoro work minutes</td>
            <td>
              <span onClick={() => setEditing(true)}>
                <TextField
                  editing={editing}
                  text={pomodoroWorkTime.toString()}
                  onEditText={onEditWorkMinutes}
                  onSubmit={() => setEditing(keepEditingIfNoPhoneNumber())}
                  onBlur={() => setEditing(keepEditingIfNoPhoneNumber())}
                />
              </span>
            </td>
          </tr>
          <tr>
            <td>Pomodoro break minutes</td>
            <td>
              <span onClick={() => setEditing(true)}>
                <TextField
                  editing={editing}
                  text={pomodoroBreakTime.toString()}
                  onEditText={onEditBreakMinutes}
                  onSubmit={() => setEditing(keepEditingIfNoPhoneNumber())}
                  onBlur={() => setEditing(keepEditingIfNoPhoneNumber())}
                />
              </span>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default Settings;
