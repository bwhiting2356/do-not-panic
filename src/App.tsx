/* eslint-disable prettier/prettier */
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Todos from "./components/todos/Todos";
import Projects from "./components/projects/Projects";
import { NavTabs } from "./components/header/NavTabs";
import { ConfettiAnimation } from "./components/animation/ConfettiAnimation";
import { EventToastContainer } from "./components/EventToastContainer";
import Templates from "./components/templates/Templates";
import { TotalToday } from "./components/header/TotalToday";
import Settings from "./components/settings/Settings";
import { modalMap } from "./components/modals/modalMap";
import { useAppContext } from "./context/context";
import { PomodoroDisplay } from "./components/PomodoroDisplay";
import { Archive } from "./components/analytics/Archive";

export function App() {
  const { activeModal } = useAppContext();
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
          <PomodoroDisplay />
          <TotalToday />
        </div>
        <div style={{ paddingTop: "20px" }}>
          <Routes>
            <Route path="/todos" element={<Todos />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/" element={<Todos />} />
          </Routes>
        </div>
      </Container>

      {modalMap[activeModal]}

      <ConfettiAnimation />
      <EventToastContainer />
    </Router>
  );
}
