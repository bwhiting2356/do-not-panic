import React from "react";
import { Button } from "react-bootstrap";
import { PieChart } from "react-bootstrap-icons";

interface Props {
    onClick?: () => void;
}
export function PieChartIconButton({ onClick }: Props) {
    return (
        <Button onClick={onClick} variant="primary" size="sm">
            <PieChart />
        </Button>
    )
}