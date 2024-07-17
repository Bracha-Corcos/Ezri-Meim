import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import './style.css';
import logo from './logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (userData.isApproved) {
        localStorage.setItem('userRole', userData.role);
        navigate('/');
      } else {
        setError('החשבון שלך ממתין לאישור מנהל');
      }
    } catch (err) {
      switch (err.code) {
        case 'auth/invalid-email':
          setError('שגיאה בהתחברות: האימייל אינו תקין');
          break;
        case 'auth/user-disabled':
          setError('שגיאה בהתחברות: חשבון זה הושעה');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('שגיאה בהתחברות: האימייל או הסיסמה שגויים');
          break;
        default:
          setError('שגיאה בהתחברות: האימייל או הסיסמה שגויים');
          break;
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('אנא הכנס כתובת אימייל לאיפוס הסיסמה');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('הוראות לאיפוס הסיסמה נשלחו לכתובת האימייל שלך');
      setError('');
    } catch (err) {
      setError(`שגיאה בשליחת אימייל לאיפוס סיסמה: ${err.message}`);
    }
  };

  return (
    <div className="signup-container">
      <img src={logo} alt="Logo" className="logo" />
      <form className="signup-form" onSubmit={handleLogin}>
        <h1>התחברות</h1>
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
        <div className="input-row" style={{ marginBottom: '20px' }}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-row">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="סיסמה"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="input-row">
          <p onClick={handleForgotPassword} className="forgot-password-link">שכחת סיסמה?</p>
        </div>
        <button type="submit">התחברות</button>
        <p>
          עוד לא רשום? <Link to="/signup">הרשם</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;