/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-empty-function */
import React from "react";
import cn from "classnames";
import { useNavigate } from "react-router";
import {
  Button,
  ButtonGroup,
  Form,
  OverlayTrigger,
  Popover,
  Table,
} from "react-bootstrap";
import { Filter } from "react-bootstrap-icons";
import { TodoRow } from "./TodoRow";
import { Due } from "../../shared/due.type";
import { Todo } from "../../shared/todo";
import { SmallEditIconButton } from "../icon-buttons/SmallEditIconButton";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectProjects } from "../../features/projects/selectors";
import {
  editAllProjects,
  editProject,
} from "../../features/projects/projectSlice";
import { Project } from "../../shared/project";

type Props = {
  todos: Todo[];
  due: Due;
};

export function TodoTable({ todos, due }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const navigateToProjects = () => navigate("/projects");
  const projects = useAppSelector(selectProjects);

  const onSelectAll = () => {
    const newProjects = projects.map((project) => ({
      ...project,
      includeInArchiveFilter: true,
    }));
    dispatch(editAllProjects(newProjects));
  };
  const onSelectNone = () => {
    const newProjects = projects.map((project) => ({
      ...project,
      includeInArchiveFilter: false,
    }));
    dispatch(editAllProjects(newProjects));
  };

  const onChangeProjectChecked = (projectId: string, checked: boolean) => {
    const project = projects.find((p) => p.id === projectId) as Project;
    dispatch(
      editProject({
        id: projectId,
        newProject: {
          ...project,
          includeInArchiveFilter: checked,
        },
      })
    );
  };
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Filter by project</Popover.Header>

      <Popover.Body>
        <Form>
          <ButtonGroup style={{ width: "100%", marginBottom: "10px" }}>
            <Button
              size="sm"
              style={{ width: "50%" }}
              variant="outline-primary"
              onClick={onSelectAll}
            >
              Select All
            </Button>
            <Button
              size="sm"
              style={{ width: "50%" }}
              variant="outline-primary"
              onClick={onSelectNone}
            >
              Select None
            </Button>
          </ButtonGroup>
          {projects.map(({ id, title, includeInArchiveFilter }) => (
            <Form.Check
              key={id}
              type="checkbox"
              id="custom-switch"
              checked={includeInArchiveFilter}
              label={title || "No Project"}
              onChange={(e) => onChangeProjectChecked(id, e.target.checked)}
            />
          ))}
        </Form>
      </Popover.Body>
    </Popover>
  );

  return (
    <div
      className={cn({ "main-todos": due !== Due.Archived })}
      style={{ textAlign: "left" }}
    >
      <Table className="table" size="sm">
        <thead>
          <tr>
            <th className="done">{due === Due.Archived ? "Date" : "Do"}</th>
            <th className="name">Name</th>
            <th className="poms">Exp.</th>
            <th className="poms">Cpl.</th>
            <th className="project" style={{ position: "relative" }}>
              <span style={{ marginRight: "10px" }}>Project</span>
              {due === Due.Archived ? (
                <div
                  style={{ position: "absolute", right: "5px", top: "-2px" }}
                >
                  <ButtonGroup></ButtonGroup>
                  <OverlayTrigger
                    trigger="click"
                    placement="top"
                    overlay={popover}
                    rootClose
                  >
                    <Button size="sm">
                      <Filter />
                    </Button>
                  </OverlayTrigger>{" "}
                </div>
              ) : (
                <SmallEditIconButton onClick={navigateToProjects} />
              )}
            </th>
            <th className="links">Link</th>
            <th className="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <TodoRow key={todo.id} todo={todo} />
          ))}
        </tbody>
      </Table>
    </div>
  );
}
