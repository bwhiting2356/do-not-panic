import React from "react";
import { PieChart } from "react-bootstrap-icons";

type Props = {
  onClick?: () => void;
  tabIndex?: number;
};

export function SmallPieChartIconButton(props: Props) {
  return (
    <button className="small-invisible-button" {...props}>
      <PieChart />
    </button>
  );
}
