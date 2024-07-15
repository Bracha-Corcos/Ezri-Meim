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
  const [role, setRole] = useState('forumMember');
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

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
    setError('');

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
        username: username,
        phone: phone,
        address: address,
        role: role,
        isApproved: false,
        createdAt: new Date()
      });

      setShowConfirmation(true);
    } catch (err) {
      console.error('Error adding document: ', err);
      setError(`שגיאה ברישום: ${err.message}`);
    }
  };

  return (
    <div className="signup-container">
      <img src={logo} alt="Logo" className="logo" />
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>הרשמה</h1>
        {error && <p className="error">{error}</p>}
        <div className="input-row">
          <input
            type="text"
            id="firstname"
            name="firstname"
            placeholder="שם פרטי"
            autoComplete="given-name"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="שם משפחה"
            autoComplete="family-name"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="input-row">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="אימייל"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-row">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="שם משתמש"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="סיסמה"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="אימות סיסמה"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="input-row">
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="טלפון"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            id="address"
            name="address"
            placeholder="כתובת מגורים"
            autoComplete="street-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="input-row">
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="forumMember">חבר פורומים</option>
            <option value="volunteer">מתנדב</option>
            <option value="admin">מנהל</option> {/* Adding admin option */}
          </select>
        </div>
        <button type="submit">הרשמה</button>
        <p>
          כבר רשום? <Link to="/login">התחבר</Link>
        </p>
      </form>
      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <h2>ההרשמה נקלטה</h2>
            <p>המתן לאישור</p>
            <button onClick={() => setShowConfirmation(false)}>סגור</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
