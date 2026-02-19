import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateExam from './components/CreateExam';
import ManageExam from './components/ManageExam'; // <-- 1. IMPORT THIS
import TakeExam from './components/TakeExam';
import ResultHistory from './components/ResultHistory';
import Signup from './components/Signup';
import AdminResults from './components/AdminResults';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-exam" element={<CreateExam />} />
                <Route path="/manage-exam/:id" element={<ManageExam />} /> {/* <-- 2. ADD THIS ROUTE */}
                <Route path="/take-exam/:id" element={<TakeExam />} />
                <Route path="/history" element={<ResultHistory />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin-results/:id" element={<AdminResults />} />
            </Routes>
        </Router>
    );
}

export default App;