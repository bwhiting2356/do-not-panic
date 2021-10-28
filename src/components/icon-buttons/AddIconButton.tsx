import React from "react";
import { Button } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";

interface Props {
    onClick?: () => void;
}
export function AddIconButton({ onClick }: Props) {
    return (
        <Button onClick={onClick} variant="primary" size="sm">
            <Plus />
        </Button>
    )
}