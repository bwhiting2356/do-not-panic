import Select, { SingleValue } from "react-select";
import React, { KeyboardEventHandler, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { selectCurrentProjects } from "../features/projects/selectors";
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
  const projectOptions = useAppSelector(selectCurrentProjects);
  const currentProjectTitle =
    projectOptions.find((project) => project.id === projectId)?.title ||
    "No Project";
  const [newProjectOption, setNewProjectOption] = useState<SelectOption>({
    label: currentProjectTitle,
    value: projectId,
  });

  if (!isEditing) {
    return (
      <div className="editable-item">
        <div className="content">{currentProjectTitle}</div>
      </div>
    );
  }

  const selectOptions: SelectOption[] = projectOptions.map((project) => ({
    label: project.title,
    value: project.id,
  }));

  const onOptionChange = (option: SingleValue<SelectOption>) => {
    if (option) {
      setNewProjectOption(option);
      onChangeProject(option.value);
    }
  };

  const onBlur = () => onChangeProject(newProjectOption.value);
  const onEnter: KeyboardEventHandler<HTMLDivElement> = (e) => {
    onChangeProject(newProjectOption.value);
    if (e.key === "Enter") {
      onSubmit();
    }
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
