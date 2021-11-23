import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Todos from './Todos';
import Projects from './Projects';
import { NavTabs } from './components/NavTabs';
import { TopInfo } from './components/TopInfo';


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
                        <Route index element={<Todos />} />
                    </Routes>
                </div>
            </Container>
        </Router>        
    )
}
