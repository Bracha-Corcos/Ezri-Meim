import React, { useState } from 'react';
import './style.css';
import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import logo from './logo.png';

const Signup = () => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const isEmailExists = async (email) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const isUsernameExists = async (username) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (password.length < 6) {
      setError('אורך הסיסמה חייב להיות לפחות 6 תווים');
      return;
    }

    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    if (await isEmailExists(email)) {
      setError('אימייל קיים במערכת');
      return;
    }

    if (await isUsernameExists(username)) {
      setError('שם משתמש תפוס');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const usersRef = collection(db, 'users');
      await setDoc(doc(usersRef, user.uid), {
        uid: user.uid,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        username: username,
        phone: phone,
        address: address
      });

      console.log('נרשמת בהצלחה');
    } catch (err) {
      console.error('Error adding document: ', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Operation not allowed.');
      } else if (err.code === 'auth/weak-password') {
        setError('The password is too weak.');
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return React.createElement(
    'div',
    { className: 'signup-container' },
    React.createElement('img', { src: logo, alt: 'Logo', className: 'logo' }),
    React.createElement(
      'form',
      { className: 'signup-form', onSubmit: handleSubmit },
      React.createElement('h1', null, 'הרשמה'),
      error && React.createElement('p', { className: 'error' }, error),
      React.createElement(
        'div',
        { className: 'input-row' },
        React.createElement('input', {
          type: 'text',
          id: 'firstname',
          name: 'firstname',
          placeholder: 'שם פרטי',
          autoComplete: 'given-name',
          value: firstname,
          onChange: (e) => setFirstName(e.target.value)
        }),
        React.createElement('input', {
          type: 'text',
          id: 'lastname',
          name: 'lastname',
          placeholder: 'שם משפחה',
          autoComplete: 'family-name',
          value: lastname,
          onChange: (e) => setLastName(e.target.value)
        })
      ),
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
        }),
      ),
      React.createElement(
        'div',
        { className: 'input-row' },
        React.createElement('input', {
          type: 'text',
          id: 'username',
          name: 'username',
          placeholder: 'שם משתמש',
          autoComplete: 'username',
          value: username,
          onChange: (e) => setUsername(e.target.value)
        }),
        React.createElement('input', {
          type: 'password',
          id: 'password',
          name: 'password',
          placeholder: 'סיסמה',
          autoComplete: 'new-password',
          value: password,
          onChange: (e) => setPassword(e.target.value)
        }),
        React.createElement('input', {
          type: 'password',
          id: 'confirmPassword',
          name: 'confirmPassword',
          placeholder: 'אימות סיסמה',
          autoComplete: 'new-password',
          value: confirmPassword,
          onChange: (e) => setConfirmPassword(e.target.value)
        })
      ),
      React.createElement(
        'div',
        { className: 'input-row' },
        React.createElement('input', {
          type: 'tel',
          id: 'phone',
          name: 'phone',
          placeholder: 'טלפון',
          autoComplete: 'tel',
          value: phone,
          onChange: (e) => setPhone(e.target.value)
        }),
        React.createElement('input', {
          type: 'text',
          id: 'address',
          name: 'address',
          placeholder: 'כתובת מגורים',
          autoComplete: 'street-address',
          value: address,
          onChange: (e) => setAddress(e.target.value)
        })
      ),
      React.createElement('button', { type: 'submit' }, 'הרשמה'),
      React.createElement(
        'p',
        null,
        'כבר רשום? ',
        React.createElement(Link, { to: '/login' }, 'התחבר')
      )
    )
  );
};

export default Signup;