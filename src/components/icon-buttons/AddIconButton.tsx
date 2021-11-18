import React from "react";
import { Plus } from "react-bootstrap-icons";
import { IconButton } from "./IconButton";

type Props = {
    onClick?: (e?: any) => void;
    tabIndex?: number
}
export function AddIconButton(props: Props) {
    return (
        <IconButton {...props} variant="outline-primary" Icon={Plus} />
    )
}