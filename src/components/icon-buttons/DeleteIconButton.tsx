import React from "react";
import { Button } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

interface Props {
    onClick?: () => void;
    tabIndex?: number;
}
export function DeleteIconButton({ onClick, tabIndex }: Props) {
    return (
        <Button tabIndex={tabIndex} onClick={onClick} variant="outline-danger" size="sm">
            <Trash />
        </Button>
    )
}