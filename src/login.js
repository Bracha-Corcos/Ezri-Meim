import React, { useState } from 'react';
import './style.css';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import logo from './logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("התחברת בהצלחה");
    } catch (err) {
      console.log(err);
    }
  };

  return React.createElement(
    'div',
    { className: 'signup-container' },
    React.createElement('img', { src: logo, alt: 'Logo', className: 'logo' }),
    React.createElement(
      'form',
      { className: 'signup-form', onSubmit: handleSubmit },
      React.createElement('h2', null, 'התחברות'),
      React.createElement(
        'div',
        { className: 'input-row' },
        React.createElement('input', {
          type: 'email',
          id: 'email',
          name: 'email',
          placeholder: 'אימייל',
          autoComplete: 'email',
          value: email,
          onChange: (e) => setEmail(e.target.value)
        })
      ),
      React.createElement(
        'div',
        { className: 'input-row' },
        React.createElement('input', {
          type: 'password',
          id: 'password',
          name: 'password',
          placeholder: 'סיסמא',
          autoComplete: 'current-password',
          value: password,
          onChange: (e) => setPassword(e.target.value)
        })
      ),
      React.createElement('button', null, 'התחברות'),
      React.createElement('br'),
      React.createElement(
        'p',
        null,
        'אין לך חשבון? ',
        React.createElement(Link, { to: '/signup' }, 'הירשם')
      )
    )
  );
};

export default Login;
