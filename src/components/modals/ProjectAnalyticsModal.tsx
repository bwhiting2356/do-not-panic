import React from "react";
import { Modal } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { useAppSelector } from "../../app/hooks";
import { useAppContext } from "../../context/context";
import { selectArchivedTodos } from "../../features/todos/selectors";
import { computeChartData } from "../../shared/util";

export function ProjectAnalyticsModal() {
    const { showProjectAnalytics, setShowProjectAnalytics } = useAppContext();
    const archivedTodos = useAppSelector(selectArchivedTodos);

  return (
    <Modal
      show={showProjectAnalytics}
      onHide={() => setShowProjectAnalytics(!showProjectAnalytics)}
      style={{ textAlign: "center" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Archived Todo Total Poms by Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ width: "450px" }}>
            <Pie data={computeChartData(archivedTodos)} />
        </div>
      </Modal.Body>
    </Modal>
  );
}
