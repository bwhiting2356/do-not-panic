import React from "react";
import { Button } from "react-bootstrap";
import { Clock } from "react-bootstrap-icons";

interface Props {
    onClick?: () => void;
}
export function LaterIconButton({ onClick }: Props) {
    return (
        <Button onClick={onClick} variant="primary" size="sm">
            <Clock />
        </Button>
    )
}