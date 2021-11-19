import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Todos from './Todos';

export function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Todos />} />
                <Route path="/projects" element={<Todos />} />
            </Routes>
        </Router>
    )
}
