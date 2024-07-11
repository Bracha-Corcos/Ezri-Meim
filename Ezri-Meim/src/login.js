import React, { useState } from 'react';
import './style.css';
import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (!userData.isApproved) {
        setError('החשבון שלך עדיין לא אושר. אנא המתן לאישור מנהל.');
        await auth.signOut();
        return;
      }

      const role = userData.role;
      localStorage.setItem('userRole', role);
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      setError('שם משתמש או סיסמה שגויים');
    }
  };

  return (
    <div className="signup-container">
      <img src={logo} alt="Logo" className="logo" />
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>התחברות</h2>
        {error && <p className="error">{error}</p>}
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
            type="password"
            id="password"
            name="password"
            placeholder="סיסמה"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">התחברות</button>
        <br />
        <p>
          אין לך חשבון? <Link to="/signup">הירשם</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
