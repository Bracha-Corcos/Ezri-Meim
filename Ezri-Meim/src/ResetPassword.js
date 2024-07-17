// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmPasswordReset, getAuth } from 'firebase/auth';
// import './style.css';
// import logo from './logo.png';

// const ResetPassword = () => {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();
//   const auth = getAuth();

//   const validatePassword = (password) => {
//     const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//     return re.test(password);
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!validatePassword(password)) {
//       setError('הסיסמה חייבת להיות באורך של לפחות 8 תווים ולכלול גם אותיות וגם מספרים');
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError('הסיסמאות אינן תואמות');
//       return;
//     }

//     // קבלת ה-oobCode מה-URL
//     const queryParams = new URLSearchParams(location.search);
//     const oobCode = queryParams.get('oobCode');

//     if (!oobCode) {
//       setError('קוד לא תקין לאיפוס סיסמה');
//       return;
//     }

//     try {
//       // ביצוע איפוס הסיסמה עם ה-oobCode
//       await confirmPasswordReset(auth, oobCode, password);
//       navigate('/login');
//     } catch (err) {
//       setError(`שגיאה באיפוס הסיסמה: ${err.message}`);
//     }
//   };

//   return (
//     <div className="reset-password-container">
//       <img src={logo} alt="Logo" className="logo" />
//       <form className="reset-password-form" onSubmit={handleResetPassword}>
//         <h1>איפוס סיסמה</h1>
//         {error && <p className="error">{error}</p>}
//         <div className="input-row">
//           <input
//             type="password"
//             id="password"
//             name="password"
//             placeholder="סיסמה חדשה"
//             autoComplete="new-password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             onFocus={() => setError('')}
//           />
//           <input
//             type="password"
//             id="confirmPassword"
//             name="confirmPassword"
//             placeholder="אימות סיסמה"
//             autoComplete="new-password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             onFocus={() => setError('')}
//           />
//         </div>
//         <button type="submit">אפס סיסמה</button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;


import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmPasswordReset, getAuth, verifyPasswordResetCode } from 'firebase/auth';
import './style.css';
import logo from './logo.png';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const oobCode = queryParams.get('oobCode');
    const mode = queryParams.get('mode');

    if (oobCode && mode === 'resetPassword') {
      // Verify the oobCode and get the email
      verifyPasswordResetCode(auth, oobCode)
        .then((email) => {
          setEmail(email);
        })
        .catch((error) => {
          setError('Invalid or expired action code. Please try resetting your password again.');
        });
    } else {
      setError('Invalid or expired action code. Please try resetting your password again.');
    }
  }, [auth, location.search]);

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-zא-ת])(?=.*\d)[A-Za-zא-ת\d]{8,}$/;
    return re.test(password);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('הסיסמה חייבת להיות באורך של לפחות 8 תווים ולכלול גם אותיות וגם מספרים');
      return;
    }

    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const oobCode = queryParams.get('oobCode');

    if (!oobCode) {
      setError('קוד לא תקין לאיפוס סיסמה');
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, password);
      navigate('/login');
    } catch (err) {
      setError(`שגיאה באיפוס הסיסמה: ${err.message}`);
    }
  };

  return (
    <div className="reset-password-container">
      <img src={logo} alt="Logo" className="logo" />
      <form className="reset-password-form" onSubmit={handleResetPassword}>
        <h1>איפוס סיסמה</h1>
        {email && <p className="email-info">לאימייל: {email}</p>}
        {error && <p className="error">{error}</p>}
        <div className="input-row">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="סיסמה חדשה"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setError('')}
          />
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="אימות סיסמה"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setError('')}
          />
        </div>
        <button type="submit">אפס סיסמה</button>
      </form>
    </div>
  );
};

export default ResetPassword;
