import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Report from './screens/Report';
import Privacy from './screens/Privacy';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/report' element={<Report />} />
        <Route path='/privacy' element={<Privacy />} />
      </Routes>
    </Router>
  );
}