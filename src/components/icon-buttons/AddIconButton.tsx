import React from "react";
import { Button } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";

type Props = {
    onClick?: (e?: any) => void;
    tabIndex?: number
}
export function AddIconButton({ onClick, tabIndex }: Props) {
    return (
        <Button onClick={onClick} tabIndex={tabIndex} variant="outline-primary" size="sm">
            <Plus />
        </Button>
    )
}