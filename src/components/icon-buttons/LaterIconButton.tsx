import React from "react";
import { Button } from "react-bootstrap";
import { Clock } from "react-bootstrap-icons";

type Props = {
    onClick?: () => void;
    tabIndex?: number;
}
export function LaterIconButton({ onClick, tabIndex }: Props) {
    return (
        <Button onClick={onClick} tabIndex={tabIndex} variant="outline-primary" size="sm">
            <Clock />
        </Button>
    )
}