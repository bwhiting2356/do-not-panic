import React from "react";
import { Button } from "react-bootstrap";
import { ArrowBarUp } from "react-bootstrap-icons";

interface Props {
    onClick?: () => void;
}
export function MoveUpIconButton({ onClick }: Props) {
    return (
        <Button onClick={onClick} variant="primary" size="sm">
            <ArrowBarUp />
        </Button>
    )
}