import React from "react";
import { PomodoroTimer } from "./PomodoroTimer";
import { TodalToday } from "./TotalToday";

export function TopInfo() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <PomodoroTimer />
      <TodalToday />
    </div>
  );
}
