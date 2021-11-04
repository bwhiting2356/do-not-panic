import React from "react";
import { Button } from "react-bootstrap";
import { BrightnessAltHigh } from "react-bootstrap-icons";

interface Props {
    onClick?: () => void;
    tabIndex?: number;
}
export function TodayIconButton({ onClick, tabIndex }: Props) {
    return (
        <Button onClick={onClick} tabIndex={tabIndex} variant="outline-primary" size="sm">
            <BrightnessAltHigh />
        </Button>
    )
}