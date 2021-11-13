import React from "react";
import { Button } from "react-bootstrap";
import { Icon } from "react-bootstrap-icons";

type Props = {
    onClick?: () => void;
    tabIndex?: number;
    Icon: Icon;
    variant: string;
    text?: string
}
export function IconButton({ onClick, tabIndex, Icon, variant, text }: Props) {
    return (
        <Button tabIndex={tabIndex} onClick={onClick} variant={variant} size={text ? undefined : 'sm'}>
            <Icon style={text ? { marginRight: '10px' } : {} }/>
            { text }
        </Button>
    )
}