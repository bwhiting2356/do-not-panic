import React from "react";
import { Button } from "react-bootstrap";
import { Pen } from "react-bootstrap-icons";

interface Props {
    onClick?: () => void;
}
export function EditIconButton({ onClick }: Props) {
    return (
        <Button onClick={onClick} variant="primary" size="sm">
            <Pen />
        </Button>
    )
}