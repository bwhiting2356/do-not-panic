import React, { useState } from "react";
import { useAppSelector } from "../app/hooks";
import Select, { SingleValue } from "react-select";
import { selectProjects } from "../features/projects/selectors";
import { ID } from "../shared/id.type";

type Props = {
  projectId?: ID;
  isEditing: boolean;
  onChangeProject: (newProject: string) => void;
  onSubmit: () => void;
};

interface SelectOption {
  value: string;
  label: string;
}

export function ProjectDropdown({
  projectId = "",
  isEditing,
  onChangeProject,
  onSubmit,
}: Props) {
  const projectOptions = useAppSelector(selectProjects);
  const currentProjectTitle =
    projectOptions.find((project) => project.id === projectId)?.title ||
    "No Project";
  const [newProjectOption, setNewProjectOption] = useState<SelectOption>({
    value: projectId,
    label: currentProjectTitle,
  });

  if (!isEditing) {
    return (
      <div className="editable-item">
        <div className="content">{currentProjectTitle}</div>
      </div>
    );
  }

  const selectOptions: SelectOption[] = projectOptions.map((project) => ({
    value: project.id,
    label: project.title,
  }));

  const onOptionChange = (option: SingleValue<SelectOption>) => {
    if (option) {
      setNewProjectOption(option);
      onChangeProject(option.value);
    }
  };

  const onBlur = () => onChangeProject(newProjectOption.value);
  const onEnter = (e: any) => {
    onChangeProject(newProjectOption.value);
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
