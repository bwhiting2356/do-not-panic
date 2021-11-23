import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Todos from './Todos';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavTabs } from './components/NavTabs';

export function App() {
    return (
        <Router>
            <Container>
                <NavTabs />
                <Routes>
                    <Route path="/todos" element={<Todos />} />
                    <Route path="/projects" element={<Todos />} />
                    <Route index element={<Todos />} />
                </Routes>
            </Container>
        </Router>        
    )
}
