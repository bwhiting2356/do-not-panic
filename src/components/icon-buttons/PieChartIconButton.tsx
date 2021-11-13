import React from "react";  
import { PieChart } from "react-bootstrap-icons";
import { IconButton } from "./IconButton";

type Props = {
    onClick?: () => void;
    tabIndex?: number;
}

export function PieChartIconButton(props: Props) {
    return (
        <IconButton variant="outline-primary" Icon={PieChart} {...props} />
    )
}