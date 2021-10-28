import React from "react";
import { Button } from "react-bootstrap";
import { ArrowBarDown } from "react-bootstrap-icons";

interface Props {
    onClick?: () => void;
}
export function MoveDownIconButton({ onClick }: Props) {
    return (
        <Button onClick={onClick} variant="primary" size="sm">
            <ArrowBarDown />
        </Button>
    )
}