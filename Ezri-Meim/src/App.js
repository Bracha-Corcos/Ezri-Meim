import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import Signup from './signup.js';
import Login from './login.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/signup" />} />
      </Routes>
    </BrowserRouter>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

export default App;
