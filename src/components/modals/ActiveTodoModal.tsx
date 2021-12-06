import React from "react";
import { Button, ButtonGroup, Card, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useAppContext } from "../../context/context";
import { selectProjects } from "../../features/projects/selectors";
import { selectActiveTodo } from "../../features/todos/selectors";
import { changeActiveTodoId, editTodo } from "../../features/todos/todoSlice";
import { truncateUrl } from "../../shared/util";
import { PomodoroDisplay } from "../PomodoroDisplay";

export function ActiveTodoModal() {
  const dispatch = useAppDispatch();
  const activeTodo = useAppSelector(selectActiveTodo);
  const projects = useAppSelector(selectProjects);
  const { setActiveModal } = useAppContext();

  if (!activeTodo) return null;

  const { id, name, poms, completedPoms, links, projectId } = activeTodo;
  const [link] = links;

  const onComplete = () => {
    dispatch(editTodo({ id, newTodo: { ...activeTodo, done: true } }));
    dispatch(changeActiveTodoId(""));
  };

  const onCancel = () => {
    dispatch(changeActiveTodoId(""));
  };

  const projectName =
    projects.find((project) => project.id === projectId)?.title || "";

  const urlLength = 30;

  return (
    <Modal
      show={true}
      onHide={() => setActiveModal("")}
      style={{ textAlign: "center" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Active Todo</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <PomodoroDisplay />
        <Card style={{ width: "18rem", marginTop: "15px" }}>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {projectName}
            </Card.Subtitle>
            <Card.Text>
              {completedPoms || 0}/{poms || 0} poms complete
            </Card.Text>
            <Card.Link href={link.url} target="_blank">
              {truncateUrl(link.url, urlLength)}
            </Card.Link>
            <div style={{ marginTop: "20px" }}>
              <ButtonGroup>
                <Button variant="primary" onClick={onComplete}>
                  Complete
                </Button>
                <Button variant="outline-danger" onClick={onCancel}>
                  Cancel
                </Button>
              </ButtonGroup>
            </div>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
}
