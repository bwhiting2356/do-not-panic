import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Todos from './components/todos/Todos';
import Projects from './components/projects/Projects';
import { NavTabs } from './components/header/NavTabs';
import { TopInfo } from './components/header/TopInfo';
import { KeyboardShortcutsModal } from './components/modals/KeyboardShortcutsModal';
import { ProjectAnalyticsModal } from './components/modals/project-analytics/ProjectAnalyticsModal';
import { ConfettiAnimation } from './components/animation/ConfettiAnimation';
import { EventToastContainer } from './components/EventToastContainer';
import Templates from './components/templates/Templates';

export function App() {
    return (
        <Router>
            <Container>
                <div style={{ position: 'relative', display: 'flex', marginTop: '35px'}}>
                    <div style={{ position: 'absolute', top: '-27px', right: 0 }}>
                        <TopInfo />
                    </div>
                    <NavTabs />
                </div>
                <div style={{ paddingTop: '20px'}}>
                    <Routes>
                        <Route path="/todos" element={<Todos />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/templates" element={<Templates />} />
                        <Route path="/" element={<Todos />} />
                    </Routes>
                </div>
            </Container>
            
            <KeyboardShortcutsModal />
            <ProjectAnalyticsModal />
            <ConfettiAnimation />
            <EventToastContainer />
        </Router>        
    )
}
