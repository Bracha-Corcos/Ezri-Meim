import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from './firebase.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import logo from './logo.png';
import './style.css';

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUser(userDoc.data());
      } else {
        navigate('/manage-users');
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleMaritalStatusChange = () => {
    setShowConfirmation(true);
  };

  const confirmMaritalStatusChange = async () => {
    const newStatus = !user.isMarried;
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isMarried: newStatus });
    setUser(prevState => ({ ...prevState, isMarried: newStatus }));
    setShowConfirmation(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-detail-container">
    <div className="page-header">
      <img src={logo} alt="Logo" className="logo" />
      <h1>פרטי משתמש</h1>
    </div>
    <div className="user-detail-content">
      <p><strong>שם פרטי:</strong> {user.firstname}</p>
      <p><strong>שם משפחה:</strong> {user.lastname}</p>
      <p><strong>אימייל:</strong> {user.email}</p>
      <p><strong>שם משתמש:</strong> {user.username}</p>
      <p><strong>טלפון:</strong> {user.phone}</p>
      <p><strong>כתובת:</strong> {user.address}</p>
      <p><strong>תפקיד:</strong> {user.role === 'admin' ? 'מנהל' : 'חבר פורומים'}</p>
      <p><strong>מאושר:</strong> {user.isApproved ? 'כן' : 'לא'}</p>
      <div className="marital-status">
        <strong>סטטוס:</strong>
        <span className="status-spacer"></span>
        <label className="checkbox-container">
          נשואה/נשוי
          <input
            type="checkbox"
            checked={user.isMarried}
            onChange={handleMaritalStatusChange}
          />
          <span className="checkmark"></span>
        </label>
      </div>
      <p><strong>מגדר:</strong> {user.gender === 'male' ? 'זכר' : 'נקבה'}</p>
      <button onClick={() => navigate('/manage-users')}>חזרה לניהול משתמשים</button>
    </div>
    {showConfirmation && (
      <div className="modal">
        <div className="modal-content">
          <p>האם לשנות את סטטוס המשתמש?</p>
          <div className="modal-buttons">
            <button onClick={confirmMaritalStatusChange}>אישור</button>
            <button onClick={() => setShowConfirmation(false)}>ביטול</button>
          </div>
        </div>
      </div>
    )}
  <div className="back-to-home">
      <Link to="/" className="back-button">חזרה לדף הבית</Link>
    </div>
  </div>
  );
};

export default UserDetail;