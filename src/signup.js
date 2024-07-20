import React, { useState } from 'react';
import './style.css';
import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
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
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const [isMarried, setIsMarried] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [situation, setSituation] = useState('');
  const [hasPerinalDisease, setHasPerinalDisease] = useState('');
  const [treatmentSetting, setTreatmentSetting] = useState('');
  const [yearsDiagnosed, setYearsDiagnosed] = useState('');
  const [accompanyingDiseases, setAccompanyingDiseases] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
 
  const navigate = useNavigate();

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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-zא-ת])(?=.*\d)[A-Za-zא-ת\d]{8,}$/;
    return re.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstname) {
      setError('שם פרטי הוא שדה חובה');
      return;
    }

    if (!lastname) {
      setError('שם משפחה הוא שדה חובה');
      return;
    }

    if (!email) {
      setError('אימייל הוא שדה חובה');
      return;
    }

    if (!validateEmail(email)) {
      setError('אימייל לא חוקי');
      return;
    }

    if (await isEmailExists(email)) {
      setError('אימייל קיים במערכת');
      return;
    }

    if (!username) {
      setError('שם משתמש הוא שדה חובה');
      return;
    }

    if (await isUsernameExists(username)) {
      setError('שם משתמש תפוס');
      return;
    }

    if (!password) {
      setError('סיסמה היא שדה חובה');
      return;
    }

    if (!validatePassword(password)) {
      setError('הסיסמה חייבת להיות באורך של לפחות 8 תווים ולכלול גם אותיות וגם מספרים');
      return;
    }

    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    if (!phone) {
      setError('טלפון הוא שדה חובה');
      return;
    }

    if (!validatePhone(phone)) {
      setError('מספר טלפון לא חוקי');
      return;
    }

    if (!address) {
      setError('כתובת מגורים היא שדה חובה');
      return;
    }
    
    if (!age || isNaN(age) || age <= 0) {
      setError('גיל חייב להיות מספר חיובי');
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
        gender: gender,
        isMarried: isMarried,
        diagnosis: diagnosis,
        situation: situation,
        hasPerinalDisease: hasPerinalDisease,
        treatmentSetting: treatmentSetting,
        yearsDiagnosed: yearsDiagnosed,
        accompanyingDiseases: accompanyingDiseases,
        age: parseInt(age),
        isApproved: false,
        isSuspended: false,
        createdAt: new Date()
      });

      // שמירת הערכים ב-localStorage
      localStorage.setItem('userRole', role);
      localStorage.setItem('userGender', gender);
      localStorage.setItem('userMaritalStatus', isMarried.toString());

      setShowConfirmationModal(true);
    } catch (err) {
      console.error('Error adding document: ', err);
      setError(`שגיאה ברישום: ${err.message}`);
    }
  };

  const handleConfirmation = () => {
    setShowConfirmationModal(false);
    navigate('/');
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
            onFocus={() => setShowPasswordHint(true)}
            onBlur={() => setShowPasswordHint(false)}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {showPasswordHint && <p className="password-hint">הסיסמה חייבת להיות באורך של לפחות 8 תווים ולכלול גם אותיות וגם מספרים</p>}
        <div className="input-row">
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
          <div className="select-wrapper">
            <input
              type="text"
              id="role"
              name="role"
              placeholder="תפקיד"
              value={role ? (role === 'forumMember' ? 'חבר פורומים' : 'מנהל') : ''}
              readOnly
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">תפקיד</option>
              <option value="forumMember">חבר פורומים</option>
              <option value="admin">מנהל</option>
            </select>
          </div>

          <div className="select-wrapper">
            <input
              type="text"
              id="gender"
              name="gender"
              placeholder="מגדר"
              value={gender ? (gender === 'male' ? 'זכר' : 'נקבה') : ''}
              readOnly
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">מגדר</option>
              <option value="male">זכר</option>
              <option value="female">נקבה</option>
            </select>
          </div>
        </div>
        <div className="input-row">
          <div className="select-wrapper">
            <input
              type="text"
              id="diagnosis"
              name="diagnosis"
              placeholder="במה אתה מאובחן"
              value={diagnosis ? (diagnosis === 'Crohn' ? 'קרוהן' : 'קוליטיס') : ''}
              readOnly
            />
            <select
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            >
              <option value="">במה אתה מאובחן</option>
              <option value="Crohn">קרוהן</option>
              <option value="Colitis">קוליטיס</option>
            </select>
          </div>
          <div className="select-wrapper">
            <input
              type="text"
              id="situation"
              name="situation"
              placeholder="מה המצב שלך"
              value={situation? situation === 'easy'? 'קל': situation === 'moderate'? 'בינוני': 'קשה': ''}
              readOnly
            />
            <select
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
            >
              <option value="">מה המצב שלך</option>
              <option value="easy">קל</option>
              <option value="moderate">בינוני</option>
              <option value="difficult">קשה</option>
            </select>
          </div>
        </div>
        <div className="input-row">
          <div className="select-wrapper">
            <input
              type="text"
              id="hasPerinalDisease"
              name="hasPerinalDisease"
              placeholder="האם אתה סובל ממחלה פריאנלית"
              value={hasPerinalDisease ? (hasPerinalDisease === 'no' ? 'לא' : 'כן') : ''}
              readOnly
            />
            <select
              value={hasPerinalDisease}
              onChange={(e) => setHasPerinalDisease(e.target.value)}
            >
              <option value="">האם אתה סובל ממחלה פריאנלית</option>
              <option value="yes">כן</option>
              <option value="no">לא</option>
            </select>
          </div>
          <div className="select-wrapper">
            <input
              type="text"
              id="treatmentSetting"
              name="treatmentSetting"
              placeholder="באיזה מסגרת אתה מטופל"
              value={treatmentSetting ? (treatmentSetting === 'community' ? 'קהילה' : 'מרכז גסטרו') : ''}
              readOnly
            />
            <select
              value={treatmentSetting}
              onChange={(e) => setTreatmentSetting(e.target.value)}
            >
              <option value="">באיזה מסגרת אתה מטופל?</option>
              <option value="community">קהילה</option>
              <option value="gastroCenter">מרכז גסטרו</option>
            </select>
          </div>
        </div>
        <div className="input-row">
          <input
            type="text"
            id="yearsDiagnosed"
            name="yearsDiagnosed"
            placeholder="כמה שנים אתה מאובחן"
            value={yearsDiagnosed}
            onChange={(e) => setYearsDiagnosed(e.target.value)}
          />
          <input
            type="text"
            id="accompanyingDiseases"
            name="accompanyingDiseases"
            placeholder="האם יש לך מחלות נלוות (עור, מפרקים וכו')"
            value={accompanyingDiseases}
            onChange={(e) => setAccompanyingDiseases(e.target.value)}
          />
        </div>
        <div className="input-row">
          <input
            type="number"
            id="age"
            name="age"
            placeholder="גיל"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isMarried}
              onChange={(e) => setIsMarried(e.target.checked)}
            />
            נשואה/נשוי
          </label>
        </div>

        <button type="submit">הרשמה</button>
        <p>
          כבר רשום? <Link to="/login">התחבר</Link>
        </p>
      </form>
      {showConfirmationModal && (
        <div className="modal">
          <div className="modal-content">
            <p>הרשמה נקלטה, אנא המתן לאישור מנהל</p>
            <div className="modal-buttons">
              <button onClick={handleConfirmation}>אישור</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;