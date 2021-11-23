import React, { useRef, useState, useEffect, RefObject } from "react";
import { Form, ListGroup, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useAppContext } from "../../context/context";
import { selectProjects } from "../../features/projects/selectors";
import { editProjects } from "../../features/todos/todoSlice";
import { AddIconButton } from "../icon-buttons/AddIconButton";
import { DeleteIconButton } from "../icon-buttons/DeleteIconButton";

export function EditProjectsModal() {
  // const dispatch = useAppDispatch();
  // const inputRef = useRef<HTMLInputElement>();
  // const projectOptions = useAppSelector(selectProjects);
  // const { showEditProjects, setShowEditProjects } = useAppContext();
  // const [newProject, setNewProject] = useState("");

  // useEffect(() => {
  //   if (showEditProjects) {
  //     setTimeout(() => {
  //       inputRef && inputRef?.current?.focus();
  //     }, 10);
  //   }
  // }, [showEditProjects]);

  // const onAddNewProject = (e: any) => {
  //   e.preventDefault();
  //   const newProjects = [...projectOptions, newProject];
  //   dispatch(editProjects(newProjects));
  //   setNewProject("");
  // };

  // const onDeleteProject = (project: string) => {
  //   const index = projectOptions.indexOf(project);
  //   const newProjects = [...projectOptions];
  //   newProjects.splice(index, 1);
  //   dispatch(editProjects(newProjects));
  // };
  return null

  // return (
  //   <Modal
  //     show={showEditProjects}
  //     onHide={() => setShowEditProjects(!showEditProjects)}
  //     style={{ textAlign: "center" }}
  //   >
  //     <Modal.Header closeButton>
  //       <Modal.Title>Edit Projects</Modal.Title>
  //     </Modal.Header>
  //     <Modal.Body>
  //         <ListGroup>
  //           {projectOptions.map((projectOption) => (
  //             <ListGroup.Item
  //               key={projectOption}
  //               style={{ display: "flex", justifyContent: "space-between" }}
  //             >
  //               {projectOption}
  //               <DeleteIconButton
  //                 onClick={() => onDeleteProject(projectOption)}
  //               />
  //             </ListGroup.Item>
  //           ))}
  //           <ListGroup.Item>
  //             <Form onSubmit={onAddNewProject}>
  //               <div style={{ display: "flex" }}>
  //                 <Form.Control
  //                   ref={inputRef as RefObject<HTMLInputElement>}
  //                   placeholder="Add a new project"
  //                   type="text"
  //                   value={newProject}
  //                   onChange={(e) => setNewProject(e.target.value)}
  //                 />
  //                 <AddIconButton onClick={onAddNewProject} />
  //               </div>
  //             </Form>
  //           </ListGroup.Item>
  //         </ListGroup>
  //       </Modal.Body>
  //   </Modal>
  // );
}
