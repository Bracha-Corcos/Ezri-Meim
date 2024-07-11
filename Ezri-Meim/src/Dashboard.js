import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import AdminDashboard from './AdminDashboard.js';

const Dashboard = () => {
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        setUserRole(userData.role);
      }
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return <div>טוען...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>לוח הבקרה</h1>
      
      {/* Forum section - visible to all */}
      <div className="forum-section">
        {/* ... (forum content) ... */}
      </div>

      {/* Volunteer section - visible to volunteers and admins */}
      {(userRole === 'volunteer' || userRole === 'admin') && (
        <div className="volunteer-section">
          {/* ... (volunteer content) ... */}
        </div>
      )}

      {/* Admin section - visible only to admins */}
      {userRole === 'admin' && (
        <div className="admin-section">
          <h2>פאנל ניהול</h2>
          <AdminDashboard />
        </div>
      )}

      <Link to="/login">התנתק</Link>
    </div>
  );
};

export default Dashboard;