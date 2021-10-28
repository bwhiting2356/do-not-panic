import React from "react";
import { Button } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

interface Props {
    onClick?: () => void;
}
export function DeleteIconButton({ onClick }: Props) {
    return (
        <Button onClick={onClick} variant="danger" size="sm">
            <Trash />
        </Button>
    )
}