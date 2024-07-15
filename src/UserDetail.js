import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import logo from './logo.png';
import './style.css';

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
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
        <p><strong>תפקיד:</strong> {user.role}</p>
        <p><strong>מאושר:</strong> {user.isApproved ? 'כן' : 'לא'}</p>
        <button onClick={() => navigate('/manage-users')}>חזרה לניהול משתמשים</button>
      </div>
    </div>
  );
};

export default UserDetail;