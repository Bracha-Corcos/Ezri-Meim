import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './signup';
import Login from './login';

function App() {
  return (
    React.createElement(
      BrowserRouter,
      null,
      React.createElement(
        Routes,
        null,
        React.createElement(Route, { path: '/signup', element: React.createElement(Signup) }),
        React.createElement(Route, { path: '/login', element: React.createElement(Login) }),
        React.createElement(Route, { path: '/', element: React.createElement(Navigate, { to: '/signup' }) })
      )
    )
  );
}

export default App;