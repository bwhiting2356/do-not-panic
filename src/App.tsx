import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Todos from "./components/todos/Todos";
import Projects from "./components/projects/Projects";
import { NavTabs } from "./components/header/NavTabs";
import { KeyboardShortcutsModal } from "./components/modals/KeyboardShortcutsModal";
import { ProjectAnalyticsModal } from "./components/modals/project-analytics/ProjectAnalyticsModal";
import { ConfettiAnimation } from "./components/animation/ConfettiAnimation";
import { EventToastContainer } from "./components/EventToastContainer";
import Templates from "./components/templates/Templates";
import { PomodoroTimer } from "./components/header/PomodoroTimer";
import { TotalToday } from "./components/header/TotalToday";
import Settings from "./components/settings/Settings";
import { ActiveTodoModal } from "./components/modals/ActiveTodoModal";

export function App() {
  return (
    <Router>
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <NavTabs />
          <PomodoroTimer />
          <TotalToday />
        </div>
        <div style={{ paddingTop: "20px" }}>
          <Routes>
            <Route path="/todos" element={<Todos />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Todos />} />
          </Routes>
        </div>
      </Container>

      <KeyboardShortcutsModal />
      <ProjectAnalyticsModal />
      <ActiveTodoModal />
      <ConfettiAnimation />
      <EventToastContainer />
    </Router>
  );
}
