/* eslint-disable no-console */
import React, { useState } from "react";
import { Form, Popover } from "react-bootstrap";
import { Project } from "../../shared/project";
import { useAppSelector } from "../../app/hooks";
import { selectProjects } from "../../features/projects/selectors";

type Props = {
  onChangeProjectFilter: (
    val: { project: Project; checked: boolean }[]
  ) => void;
};

export function ProjectFilterPopover({ onChangeProjectFilter }: Props) {
  const projects = useAppSelector(selectProjects);
  const onChangeProjectChecked = (e: { target: any }) => {
    console.log(e.target);
  };
  return (
    <Popover id="filter-popover">
      <Popover.Header as="h3">Filter by project</Popover.Header>
      <Popover.Body>
        <Form>
          {projects.map((project) => (
            <Form.Check
              key={project.id}
              type="switch"
              id="custom-switch"
              label={project.title}
              onChange={onChangeProjectChecked}
            />
          ))}
        </Form>
      </Popover.Body>
    </Popover>
  );
}
