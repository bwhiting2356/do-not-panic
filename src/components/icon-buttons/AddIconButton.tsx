import React from "react";
import { Button } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";

interface Props {
    onClick?: (e?: any) => void;
    tabIndex?: number
}
export function AddIconButton({ onClick, tabIndex }: Props) {
    return (
        <Button onClick={onClick} tabIndex={tabIndex} variant="primary" size="sm">
            <Plus />
        </Button>
    )
}