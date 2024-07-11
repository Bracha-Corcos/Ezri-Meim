// src/components/HomePage.js
import React from 'react';
import { useHistory } from 'react-router-dom';

const HomePage = () => {
  const history = useHistory();

  const navigateTo = (path) => {
    history.push(path);
  };

  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <button onClick={() => navigateTo('/personal-area')}>Personal Area</button>
      <button onClick={() => navigateTo('/forums')}>Forums</button>
      <button onClick={() => navigateTo('/calendar')}>Calendar</button>
    </div>
  );
};

export default HomePage;
