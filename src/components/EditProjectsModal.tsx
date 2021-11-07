import React, { useRef, useState, useEffect, RefObject } from "react";
import { Form, ListGroup, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectProjects } from "../features/todos/selectors";
import { editProjects } from "../features/todos/todoSlice";
import { AddIconButton } from "./icon-buttons/AddIconButton";
import { DeleteIconButton } from "./icon-buttons/DeleteIconButton";

type Props = {
  show: boolean;
  toggleEditProjects: () => void;
};
export function EditProjectsModal({ show, toggleEditProjects }: Props) {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>();
  const projectOptions = useAppSelector(selectProjects);
  const [newProject, setNewProject] = useState("");

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        inputRef && inputRef?.current?.focus();
      }, 10);
    }
  }, [show]);

  const onAddNewProject = (e: any) => {
    e.preventDefault();
    const newProjects = [...projectOptions, newProject];
    dispatch(editProjects(newProjects));
    setNewProject("");
  };

  const onDeleteProject = (project: string) => {
    const index = projectOptions.indexOf(project);
    const newProjects = [...projectOptions];
    newProjects.splice(index, 1);
    dispatch(editProjects(newProjects));
  };

  return (
    <Modal
      show={show}
      onHide={toggleEditProjects}
      style={{ textAlign: "center" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Projects</Modal.Title>
      </Modal.Header>
      {show && (
        <Modal.Body>
          <ListGroup>
            {projectOptions.map((projectOption) => (
              <ListGroup.Item
                key={projectOption}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                {projectOption}
                <DeleteIconButton
                  onClick={() => onDeleteProject(projectOption)}
                />
              </ListGroup.Item>
            ))}
            <ListGroup.Item>
              <Form onSubmit={onAddNewProject}>
                <div style={{ display: "flex" }}>
                  <Form.Control
                    ref={inputRef as RefObject<HTMLInputElement>}
                    placeholder="Add a new project"
                    type="text"
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                  />
                  <AddIconButton onClick={onAddNewProject} />
                </div>
              </Form>
            </ListGroup.Item>
          </ListGroup>
          <div></div>
        </Modal.Body>
      )}
    </Modal>
  );
}
