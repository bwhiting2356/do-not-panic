import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ButtonGroup, Form, Table } from "react-bootstrap";
import { addTodo } from "../features/todos/todoSlice";
import { MoveDownIconButton } from "./icon-buttons/MoveDownIconButton";
import { MoveUpIconButton } from "./icon-buttons/MoveUpIconButton";
import { Link } from "../shared/link.interface";
import { useAppDispatch } from "../app/hooks";
import { AddIconButton } from "./icon-buttons/AddIconButton";
import { padUrlWithHttp } from "../shared/util";
import { DeleteIconButton } from "./icon-buttons/DeleteIconButton";

interface Props {}

export function NewTodoForm(props: Props) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [poms, setPoms] = useState("");
  const [links, setLinks] = useState([""]);

  console.log("links", links);

  const onSubmit = (due: "later" | "today") => {
    const newLinks: Link[] = links.map((url) => ({
      id: uuidv4(),
      url: padUrlWithHttp(url),
    }));
    dispatch(
      addTodo({
        todo: { id: uuidv4(), name, poms, links: newLinks, due, done: false },
      })
    );
    setName("");
    setPoms("");
    setLinks([""]);
  };

  const editLink = (index: number, newUrl: string) => {
    setLinks((links) =>
      links.map((link, i) => {
        if (index === i) return newUrl;
        return link;
      })
    );
  };

  const deleteLink = (index: number) => {
    setLinks((links) => links.splice(index, 1));
  };

  const addLink = () => {
    setLinks((links) => [...links, ""]);
  };

  return (
    <Table striped bordered hover className="table">
      <thead>
        <tr>
          <th className="done" style={{ visibility: "hidden" }}>
            Done
          </th>
          <th className="name">Name</th>
          <th className="poms">Poms</th>
          <th className="links">Links</th>
          <th className="actions" style={{ visibility: "hidden" }}>
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </td>
          <td>
            <Form.Control
              type="text"
              value={poms}
              onChange={(e) => setPoms(e.target.value)}
            />
          </td>
          <td
            className="links"
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <div>
              {links.map((link, i) => (
                <div key={i} className="editable-item">
                  <Form.Control
                    type="text"
                    value={link}
                    onChange={(e) => editLink(i, e.target.value)}
                  />
                  <DeleteIconButton onClick={() => deleteLink(i)} />
                </div>
              ))}
            </div>
            <div style={{ alignSelf: "flex-end" }}>
              <AddIconButton onClick={addLink} />
            </div>

            {/* <div style={{ alignSelf: "flex-end", marginTop: "10px" }}>
                            <AddIconButton onClick={() => { }} />
                        </div> */}
          </td>
          <td style={{ textAlign: "center" }}>
            <ButtonGroup>
              <MoveUpIconButton onClick={() => onSubmit("today")} />
              <MoveDownIconButton onClick={() => onSubmit("later")} />
            </ButtonGroup>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
