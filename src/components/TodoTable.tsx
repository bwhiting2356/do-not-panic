import React, { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";

import { useAppDispatch } from "../app/hooks";
import { editTodo, deleteTodo } from "../features/todos/todoSlice";
import { Due } from "../shared/due.type";
import { ID } from "../shared/id.type";
import { Project } from "../shared/project.enum";
import { Todo } from "../shared/todo.interface";
import { PieChartIconButton } from "./icon-buttons/PieChartIconButton";
import { ProjectAnalytics } from "./ProjectAnalytics";
import { TodoRow } from "./TodoRow";

interface Props {
    todos: Todo[];
    due: Due;
}

export function TodoTable({ todos, due }: Props) {
    const [showProjectAnalytics, setShowProjectAnalytics] = useState(false);
    const dispatch = useAppDispatch();
    const oppositeDue = due === Due.Today ? Due.Later : Due.Today;

    const onSetTodoDone = (todo: Todo, done: boolean) => {
        dispatch(editTodo({ id: todo.id, newTodo: { ...todo, done } }));
    };

    const toggleProjectAnalytics = () => setShowProjectAnalytics(show => !show);

    const onMoveTodoDue = (todo: Todo) => {
        dispatch(
            editTodo({
                id: todo.id,
                newTodo: { ...todo, due: oppositeDue },
            })
        );
    };

    const onEditLink = (todo: Todo, linkId: ID, newUrl: string) => {
        dispatch(
            editTodo({
                id: todo.id,
                newTodo: {
                    ...todo,
                    links: todo.links.map((link) => {
                        if (link.id === linkId) {
                            return { ...link, url: newUrl };
                        }
                        return link;
                    }),
                },
            })
        );
    };

    const onDeleteLink = (todo: Todo, linkId: ID) => {
        dispatch(
            editTodo({
                id: todo.id,
                newTodo: {
                    ...todo,
                    links: todo.links.filter((link) => link.id !== linkId),
                },
            })
        );
    };

    const onEditName = (todo: Todo, newName: string) => {
        dispatch(
            editTodo({
                id: todo.id,
                newTodo: {
                    ...todo,
                    name: newName,
                },
            })
        );
    };

    const onEditPoms = (todo: Todo, newPoms: string) => {
        dispatch(
            editTodo({
                id: todo.id,
                newTodo: {
                    ...todo,
                    poms: newPoms,
                },
            })
        );
    };

    const onEditProject = (todo: Todo, newProject: Project) => {
        dispatch(
            editTodo({
                id: todo.id,
                newTodo: {
                    ...todo,
                    project: newProject,
                },
            })
        );
    };

    const onDeleteTodo = (id: ID) => dispatch(deleteTodo({ id }));
    const onArchiveTodo = (todo: Todo) => {
        dispatch(
            editTodo({
                id: todo.id,
                newTodo: {
                    ...todo,
                    due: Due.Archived,
                    archivedDate: new Date(),
                },
            })
        );
    };

    const projectAnalyticsModal = (
        <Modal show={showProjectAnalytics} onHide={toggleProjectAnalytics} style={{ textAlign: 'center' }}>
            <Modal.Header closeButton>
                <Modal.Title>Archived Todo Total Poms by Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ProjectAnalytics />
            </Modal.Body>
        </Modal >
    )
    return (
        <div
            className={due !== Due.Archived ? "main-todos" : ""}
            style={{ textAlign: "left" }}
        >
            <Table striped bordered hover className="table">
                <thead>
                    <tr>
                        <th className="done">{due === Due.Archived ? "Date" : "Done"}</th>
                        <th className="name">Name</th>
                        <th className="poms">Poms</th>
                        <th className="links">Links</th>
                        <th className="project">
                            <span style={{ marginRight: '10px' }}>Project</span>
                            {due === Due.Archived ? <PieChartIconButton onClick={() => setShowProjectAnalytics(true)} /> : null}
                            {projectAnalyticsModal}

                        </th>
                        <th className="actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map((todo) => {
                        return (
                            <TodoRow
                                key={todo.id}
                                todo={todo}
                                onSetTodoDone={onSetTodoDone}
                                onMoveTodoDue={onMoveTodoDue}
                                onDeleteTodo={onDeleteTodo}
                                onEditLink={onEditLink}
                                onDeleteLink={onDeleteLink}
                                onEditName={onEditName}
                                onEditPoms={onEditPoms}
                                onEditProject={onEditProject}
                                onArchiveTodo={onArchiveTodo}
                                due={due}
                            />
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
}
