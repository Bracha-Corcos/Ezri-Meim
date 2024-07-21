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
     
      if (!userDoc.exists()) {
        setError('לא נמצאו פרטי משתמש');
        return;
      }

      const userData = userDoc.data();

      if (userData.isSuspended) {
        setError('חשבונך הושהה, אנא פנה למנהל הראשי');
        return;
      }

      if (!userData.isApproved && userData.role !== 'admin') {
        setError('החשבון שלך ממתין לאישור מנהל');
        return;
      }

      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userGender', userData.gender || '');
      localStorage.setItem('userMaritalStatus', (userData.isMarried || false).toString());
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('שגיאה בהתחברות: האימייל או הסיסמה שגויים');
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
            autoComplete="current-password"
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
