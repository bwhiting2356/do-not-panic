import React, { useState } from "react";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { store } from "../../app/store";
import { useAppContext } from "../../context/context";
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
import { downloadBackupFromState } from "../../shared/util";
import { TextField } from "../TextField";

function Settings() {
  const dispatch = useAppDispatch();
  const phoneNumber = useAppSelector(selectPhoneNumber);
  const { setActiveModal } = useAppContext();
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

  const downloadBackup = () => {
    downloadBackupFromState(store.getState());
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
      <ButtonGroup>
        <Button variant="info" onClick={() => downloadBackup()}>
          Download Backup
        </Button>
        <Button onClick={() => setActiveModal("restore-backup")}>
          Restore from backup
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default Settings;
