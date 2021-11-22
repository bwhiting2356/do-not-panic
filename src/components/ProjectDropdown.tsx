import React, { useState } from "react";
import { useAppSelector } from "../app/hooks";
import { selectProjects } from "../features/todos/selectors";
import Select, { SingleValue } from "react-select";

type Props = {
  project?: string;
  isEditing: boolean;
  onChangeProject: (newProject: string) => void;
  onSubmit: () => void;
};

interface SelectOption {
  value: string;
  label: string;
}

export function ProjectDropdown({
  project = "No Project",
  isEditing,
  onChangeProject,
  onSubmit,
}: Props) {
  const projectOptions = useAppSelector(selectProjects);
  const [newProjectOption, setNewProjectOption] = useState<SelectOption>({
    value: project,
    label: project,
  });

  if (!isEditing) {
    return (
      <div className="editable-item">
        <div className="content">{project}</div>
      </div>
    );
  }

  const selectOptions: SelectOption[] = projectOptions.map((opt) => ({
    value: opt,
    label: opt,
  }));

  const onOptionChange = (option: SingleValue<SelectOption>, arg: any) => {
    if (option) {
      setNewProjectOption(option);
      onChangeProject(option.value);
    }
  };

  const onBlur = () => onChangeProject(newProjectOption.value);
  const onEnter = (e: any) => {
    if (e.code === "Enter") onSubmit();
  };

  return (
    <div>
      <Select
        onKeyDown={onEnter}
        value={newProjectOption}
        placeholder="Project"
        options={selectOptions}
        onChange={onOptionChange}
        onBlur={onBlur}
      />
    </div>
  );
}
