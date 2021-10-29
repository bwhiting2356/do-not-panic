import { useEffect, useRef, useState } from "react";
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
import { Due } from "../shared/due.type";

const generateNewLink = () => ({ id: uuidv4(), url: "" });

export function NewTodoForm() {
    const dispatch = useAppDispatch();
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState<string>("");
    const [poms, setPoms] = useState<string>("");
    const [links, setLinks] = useState<Link[]>([generateNewLink()]);
    const [autoFocusedLinkId, setAutoFocusedLinkId] = useState<string>("");

    const focusNameInput = () => {
        if (nameInputRef) {
            nameInputRef?.current?.focus();
        }
    };

    const onSubmit = (due: Due) => {
        const newLinks = links.map((link) => ({
            ...link,
            url: padUrlWithHttp(link.url),
        }));
        dispatch(
            addTodo({
                todo: { id: uuidv4(), name, poms, links: newLinks, due, done: false },
            })
        );
        setName("");
        setPoms("");
        setLinks([generateNewLink()]);
        focusNameInput();
    };

    useEffect(() => {
        const listenForKeyboardShortcuts = (event: KeyboardEvent) => {
            if (event.metaKey && event.key === "Enter") {
                focusNameInput();
            }
        };
        window.addEventListener("keydown", listenForKeyboardShortcuts);
        return () =>
            window.removeEventListener("keydown", listenForKeyboardShortcuts);
    });

    const listenForSubmit = (e: any) => {
        if (e.key === "Enter") {
            onSubmit(Due.Today);
        }
    };

    const editLink = (index: number, newUrl: string) => {
        setLinks((links) =>
            links.map((link, i) => {
                if (index === i) return { ...link, url: newUrl };
                return link;
            })
        );
    };

    const deleteLink = (index: number) => {
        const linksCopy = links.slice();
        linksCopy.splice(index, 1);
        setLinks(linksCopy);
    };

    const addLink = () => {
        const newLink = generateNewLink();
        setLinks((links) => [...links, newLink]);
        setAutoFocusedLinkId(newLink.id);
    };

    const onLinkKeyDown = (e: any) => {
        if (e.key === "Tab") {
            e.preventDefault();
            addLink();
        }
        if (e.key === "Enter") {
            onSubmit(Due.Today);
        }
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
                            ref={nameInputRef}
                            autoFocus
                            type="text"
                            value={name}
                            onKeyDown={listenForSubmit}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </td>
                    <td>
                        <Form.Control
                            type="text"
                            value={poms}
                            onKeyDown={listenForSubmit}
                            onChange={(e) => setPoms(e.target.value)}
                        />
                    </td>
                    <td
                        className="links"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                        }}
                    >
                        <div>
                            {links.map((link, i) => (
                                <div key={link.id} className="editable-item">
                                    <Form.Control
                                        autoFocus={autoFocusedLinkId === link.id}
                                        type="text"
                                        value={link.url}
                                        onKeyDown={onLinkKeyDown}
                                        onChange={(e) => editLink(i, e.target.value)}
                                    />
                                    <DeleteIconButton onClick={() => deleteLink(i)} />
                                </div>
                            ))}
                        </div>
                        <div style={{ alignSelf: "flex-end" }}>
                            <AddIconButton onClick={addLink} />
                        </div>
                    </td>
                    <td style={{ textAlign: "center" }}>
                        <ButtonGroup>
                            <MoveUpIconButton onClick={() => onSubmit(Due.Today)} />
                            <MoveDownIconButton onClick={() => onSubmit(Due.Later)} />
                        </ButtonGroup>
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}
