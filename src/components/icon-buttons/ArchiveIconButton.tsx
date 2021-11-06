import React from "react";
import { Button } from "react-bootstrap";
import { Archive } from "react-bootstrap-icons";

type Props = {
    onClick?: () => void;
    tabIndex?: number
}
export function ArchiveIconButton({ onClick, tabIndex }: Props) {
    return (
        <Button onClick={onClick} tabIndex={tabIndex} variant="outline-warning" size="sm">
            <Archive />
        </Button>
    )
}