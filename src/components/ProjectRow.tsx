import React from "react";
import { ProjectActionsDropdown } from "./ProjectActionsDropdown";
import { Project } from "../shared/project";

type Props = {
  project: Project;
};

export function ProjectRow({ project }: Props) {
  //   const linkRef = useRef<HTMLInputElement>(null);
  //   const dispatch = useAppDispatch();
  //   const { editingTodoId, setEditingTodoId, selectedTodoId, setSelectedTodoId } =
  //     useAppContext();
  //   const { deleteTodoWithToast, archiveTodoWithToast, moveTodoWithToast } =
  //     useReduxActionsWithContext();
  const { id, title, description } = project;
  //   console.log('todo', todo);
  //   const isSelected = id === selectedTodoId;

  //   const onEditDone = (done: boolean) => {
  //     dispatch(editTodo({ id, newTodo: { ...todo, done } }));
  //   };

  //   const onEditDue = (due: Due) => moveTodoWithToast(todo, due);

  //   const onEditLink = (linkId: ID, newUrl: string) => {
  //     dispatch(
  //       editTodo({
  //         id,
  //         newTodo: {
  //           ...todo,
  //           links: links.map((link) => {
  //             if (link.id === linkId) {
  //               return { ...link, url: newUrl };
  //             }
  //             return link;
  //           }),
  //         },
  //       })
  //     );
  //   };

  //   const onEditName = (newName: string) => {
  //     dispatch(
  //       editTodo({
  //         id,
  //         newTodo: {
  //           ...todo,
  //           name: newName,
  //         },
  //       })
  //     );
  //   };

  //   const onEditPoms = (newPoms: string) => {
  //     dispatch(
  //       editTodo({
  //         id,
  //         newTodo: {
  //           ...todo,
  //           poms: newPoms,
  //         },
  //       })
  //     );
  //   };

  //   const focusLink = () => linkRef?.current?.focus();

  //   const onEditProject = (newProjectId: ID) => {
  //     console.log('newProjectId', newProjectId);
  //     if (newProjectId !== todo.projectId) {
  //       dispatch(
  //         editTodo({
  //           id,
  //           newTodo: {
  //             ...todo,
  //             projectId: newProjectId,
  //           },
  //         })
  //       );
  //       focusLink();
  //     }
  //   };

  //   const onDelete = () => deleteTodoWithToast(todo);
  //   const onArchiveTodo = () => archiveTodoWithToast(todo);

  //   const isEditing = editingTodoId === id;

  //   const onToggleEditingTodoId = () => {
  //     if (isEditing) {
  //       setEditingTodoId("");
  //     } else {
  //       setEditingTodoId(todo.id);
  //     }
  //   };

  //   const onRowClick = (e: any) => {
  //     const { tagName } = e.target;
  //     if (["BUTTON", "A"].includes(tagName) || isEditing) return;
  //     if (due === Due.Archived) return;
  //     setSelectedTodoId(todo.id);
  //     if (editingTodoId !== todo.id) {
  //       setEditingTodoId("");
  //     }
  //   };

  //   const onProjectDropdownSubmit = () => {
  //     if (isEditing) {
  //       setEditingTodoId("");
  //     }
  //   };

  return (
    <tr key={id}>
      <td>{title}</td>
      <td>{description}</td>
      <td className="actions vertical-align">
        <ProjectActionsDropdown
          isEditing={true}
          project={project}
          onArchiveProject={() => {}}
          onToggleEditing={() => {}}
        />
      </td>
      {/* <td className="actions">button</td> */}
    </tr>
  );
}
