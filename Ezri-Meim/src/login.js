// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
// import { auth, db } from './firebase.js';
// import { doc, getDoc } from 'firebase/firestore';
// import './style.css';
// import logo from './logo.png';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       const userDoc = await getDoc(doc(db, 'users', user.uid));
//       const userData = userDoc.data();

//       if (userData.isSuspended) {
//         setError('החשבון שלך מושהה. אנא פנה למנהל המערכת.');
//         await signOut(auth);
//         return;
//       }

//       if (userData.isApproved) {
//         localStorage.setItem('userRole', userData.role);
//         navigate('/');
//       } else {
//         setError('החשבון שלך ממתין לאישור מנהל');
//       }
//     } catch (err) {
//       setError(`שגיאה בהתחברות: ${err.message}`);
//     }
//   };

//   const handleForgotPassword = async () => {
//     if (!email) {
//       setError('אנא הכנס כתובת אימייל לאיפוס הסיסמה');
//       return;
//     }

//     try {
//       await sendPasswordResetEmail(auth, email);
//       setMessage('הוראות לאיפוס הסיסמה נשלחו לכתובת האימייל שלך');
//       setError('');
//     } catch (err) {
//       setError(`שגיאה בשליחת אימייל לאיפוס סיסמה: ${err.message}`);
//     }
//   };

//   return (
//     <div className="signup-container">
//       <img src={logo} alt="Logo" className="logo" />
//       <form className="signup-form" onSubmit={handleLogin}>
//         <h1>התחברות</h1>
//         {error && <p className="error">{error}</p>}
//         {message && <p className="message">{message}</p>}
//         <div className="input-row">
//           <input
//             type="email"
//             id="email"
//             name="email"
//             placeholder="אימייל"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div className="input-row">
//           <input
//             type="password"
//             id="password"
//             name="password"
//             placeholder="סיסמה"
//             autoComplete="new-password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <div className="input-row">
//           <p onClick={handleForgotPassword} className="forgot-password-link">שכחת סיסמה?</p>
//         </div>
//         <button type="submit">התחברות</button>
//         <p>
//           עוד לא רשום? <Link to="/signup">הרשם</Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;




// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { signInWithEmailAndPassword, sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth';
// import { auth, db } from './firebase.js';
// import { doc, getDoc } from 'firebase/firestore';
// import './style.css';
// import logo from './logo.png';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const [isResettingPassword, setIsResettingPassword] = useState(false);
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmNewPassword, setConfirmNewPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       const userDoc = await getDoc(doc(db, 'users', user.uid));
//       const userData = userDoc.data();

//       if (userData.isApproved) {
//         localStorage.setItem('userRole', userData.role);
//         navigate('/');
//       } else {
//         setError('החשבון שלך ממתין לאישור מנהל');
//       }
//     } catch (err) {
//       setError(`שגיאה בהתחברות: ${err.message}`);
//     }
//   };

//   const handleForgotPassword = async () => {
//     if (!email) {
//       setError('אנא הכנס כתובת אימייל לאיפוס הסיסמה');
//       return;
//     }

//     try {
//       await sendPasswordResetEmail(auth, email);
//       setMessage('הוראות לאיפוס הסיסמה נשלחו לכתובת האימייל שלך');
//       setError('');
//     } catch (err) {
//       setError(`שגיאה בשליחת אימייל לאיפוס סיסמה: ${err.message}`);
//     }
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (newPassword !== confirmNewPassword) {
//       setError('הסיסמאות אינן תואמות');
//       return;
//     }

//     if (!validatePassword(newPassword)) {
//       setError('הסיסמה חייבת להיות באורך של לפחות 8 תווים ולכלול גם אותיות וגם מספרים');
//       return;
//     }

//     try {
//       const code = new URLSearchParams(window.location.search).get('oobCode');
//       if (!code) {
//         setError('קוד איפוס הסיסמה לא נמצא');
//         return;
//       }
//       await confirmPasswordReset(auth, code, newPassword);
//       setMessage('הסיסמה שונתה בהצלחה');
//       setIsResettingPassword(false);
//       setError('');
//     } catch (err) {
//       setError(`שגיאה בשינוי הסיסמה: ${err.message}`);
//     }
//   };

//   const validatePassword = (password) => {
//     const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//     return re.test(password);
//   };

//   return (
//     <div className="signup-container">
//       <img src={logo} alt="Logo" className="logo" />
//       {isResettingPassword ? (
//         <form className="signup-form" onSubmit={handleResetPassword}>
//           <h1>איפוס סיסמה</h1>
//           {error && <p className="error">{error}</p>}
//           {message && <p className="message">{message}</p>}
//           <div className="input-row">
//             <input
//               type="password"
//               id="newPassword"
//               name="newPassword"
//               placeholder="סיסמה חדשה"
//               autoComplete="new-password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//             />
//           </div>
//           <div className="input-row">
//             <input
//               type="password"
//               id="confirmNewPassword"
//               name="confirmNewPassword"
//               placeholder="אימות סיסמה חדשה"
//               autoComplete="new-password"
//               value={confirmNewPassword}
//               onChange={(e) => setConfirmNewPassword(e.target.value)}
//             />
//           </div>
//           <button type="submit">שנה סיסמה</button>
//         </form>
//       ) : (
//         <form className="signup-form" onSubmit={handleLogin}>
//           <h1>התחברות</h1>
//           {error && <p className="error">{error}</p>}
//           {message && <p className="message">{message}</p>}
//           <div className="input-row">
//             <input
//               type="email"
//               id="email"
//               name="email"
//               placeholder="אימייל"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className="input-row">
//             <input
//               type="password"
//               id="password"
//               name="password"
//               placeholder="סיסמה"
//               autoComplete="new-password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <div className="input-row">
//             <p onClick={() => setIsResettingPassword(true)} className="forgot-password-link">שכחת סיסמה?</p>
//           </div>
//           <button type="submit">התחברות</button>
//           <p>
//             עוד לא רשום? <Link to="/signup">הרשם</Link>
//           </p>
//         </form>
//       )}
//     </div>
//   );
// };

// export default Login;


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
