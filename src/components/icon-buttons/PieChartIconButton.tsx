import React from "react";
import { Button } from "react-bootstrap";
import { PieChart } from "react-bootstrap-icons";

interface Props {
    onClick?: () => void;
    tabIndex?: number;
}
export function PieChartIconButton({ onClick, tabIndex }: Props) {
    return (
        <Button onClick={onClick} variant="outline-primary" size="sm">
            <PieChart />
        </Button>
    )
}