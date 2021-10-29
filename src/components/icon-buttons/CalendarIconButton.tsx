import React from "react";
import { Button } from "react-bootstrap";
import { Calendar2Plus } from "react-bootstrap-icons";

interface Props {
    onClick?: () => void;
}
export function CalendarIconButton({ onClick }: Props) {
    return (
        <Button onClick={onClick} variant="primary" size="sm">
            <Calendar2Plus />
        </Button>
    )
}