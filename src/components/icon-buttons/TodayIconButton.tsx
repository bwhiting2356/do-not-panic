import React from "react";
import { Button } from "react-bootstrap";
import { BrightnessAltHigh } from "react-bootstrap-icons";

interface Props {
    onClick?: () => void;
}
export function TodayIconButton({ onClick }: Props) {
    return (
        <Button onClick={onClick} variant="primary" size="sm">
            <BrightnessAltHigh />
        </Button>
    )
}