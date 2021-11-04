import React from "react";
import { ButtonGroup, Form } from "react-bootstrap";
import { ID } from "../shared/id.type";
import { Todo } from "../shared/todo.interface";
import { Link } from "./Link";
import { TextField } from "./TextField";
import { DeleteIconButton } from "./icon-buttons/DeleteIconButton";
import { TodayIconButton } from "./icon-buttons/TodayIconButton";
import { ArchiveIconButton } from "./icon-buttons/ArchiveIconButton";
import { LaterIconButton } from "./icon-buttons/LaterIconButton";
import { Due } from "../shared/due.type";
import { ProjectDropdown } from "./ProjectDropdown";

interface Props {
  todo: Todo;
  onSetTodoDone: (todo: Todo, done: boolean) => void;
  onEditName: (todo: Todo, newName: string) => void;
  onEditPoms: (todo: Todo, newPoms: string) => void;
  onEditProject: (todo: Todo, newProject: string) => void;
  onMoveTodoDue: (todo: Todo) => void;
  onDeleteTodo: (id: ID) => void;
  onEditLink: (todo: Todo, linkId: ID, newUrl: string) => void;
  onDeleteLink: (todo: Todo, linkId: ID) => void;
  onArchiveTodo: (todo: Todo) => void;
  due: Due;
}

export function TodoRow({
  todo,
  onSetTodoDone,
  onEditName,
  onEditPoms,
  onEditProject,
  onMoveTodoDue,
  onDeleteTodo,
  onEditLink,
  onDeleteLink,
  onArchiveTodo,
  due,
}: Props) {
  const { id, done, name, poms, links, project, archivedDate } = todo;
  return (
    <tr key={id} className={done ? "complete" : ""}>
      <td className="done vertical-align">
        {due === Due.Archived ? (
          <div>{new Date(archivedDate || "")?.toLocaleDateString("en-US")}</div>
        ) : (
          <Form.Check
            type="switch"
            checked={done}
            onChange={(e: any) => onSetTodoDone(todo, e.target.checked)}
          />
        )}
      </td>
      <td className="name vertical-align">
        <TextField
          text={name}
          onEditText={(newName) => onEditName(todo, newName)}
        />
      </td>
      <td className="poms vertical-align">
        <TextField
          text={poms}
          onEditText={(newPoms) => onEditPoms(todo, newPoms)}
        />
      </td>
      <td className="links vertical-align">
        <div>
          {links.map(({ id, url }, i) => (
            <Link
              key={id}
              url={url}
              onEditLink={(newUrl) => onEditLink(todo, id, newUrl)}
              onDeleteLink={() => onDeleteLink(todo, id)}
            />
          ))}
        </div>
      </td>
      <td className="project">
        <div>
          <ProjectDropdown
            project={project}
            onChangeProject={(newProject) => onEditProject(todo, newProject)}
          />
        </div>
      </td>
      <td className="actions">
        <ButtonGroup>
          {due === Due.Today ? (
            <LaterIconButton onClick={() => onMoveTodoDue(todo)} />
          ) : (
            <TodayIconButton onClick={() => onMoveTodoDue(todo)} />
          )}
          {due !== Due.Archived ? (
            <ArchiveIconButton onClick={() => onArchiveTodo(todo)} />
          ) : null}

          <DeleteIconButton onClick={() => onDeleteTodo(todo.id)} />
        </ButtonGroup>
      </td>
    </tr>
  );
}
