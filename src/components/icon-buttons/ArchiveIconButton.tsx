import React from "react";
import { Button } from "react-bootstrap";
import { Archive } from "react-bootstrap-icons";

interface Props {
    onClick?: () => void;
}
export function ArchiveIconButton({ onClick }: Props) {
    return (
        <Button onClick={onClick} variant="warning" size="sm">
            <Archive />
        </Button>
    )
}