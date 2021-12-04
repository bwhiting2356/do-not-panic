import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectPhoneNumber } from "../../features/settings/selectors";
import { editPhoneNumber } from "../../features/settings/settingsSlice";
import { TextField } from "../TextField";

function Settings() {
  const dispatch = useAppDispatch();
  const phoneNumber = useAppSelector(selectPhoneNumber);
  const keepEditingIfNoPhoneNumber = () => {
    if (!phoneNumber) return true;
    return false;
  };
  const [editing, setEditing] = useState(keepEditingIfNoPhoneNumber);

  const onEditPhoneNumber = (newName: string) =>
    dispatch(editPhoneNumber(newName));

  return (
    <div style={{ width: "400px" }}>
      Phone number for end-of-break text message:
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
    </div>
  );
}

export default Settings;
