import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase.js';
import { collection, getDocs, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import './style.css';
import logo from './logo.png';
import emailjs from 'emailjs-com';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [diseaseFilter, setDiseaseFilter] = useState('all');
  const [suspensionFilter, setSuspensionFilter] = useState('all');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const showConfirmationModal = (action, user) => {
    setConfirmationAction(action);
    setSelectedUser(user);
    setShowConfirmation(true);
  };

  const handleConfirmation = async () => {
    if (confirmationAction && selectedUser) {
      switch (confirmationAction) {
        case 'approve':
          await approveUser(selectedUser.id);
          break;
        case 'delete':
          await deleteUser(selectedUser.id);
          break;
        case 'updateRole':
          await updateUserRole(selectedUser.id, selectedUser.newRole);
          break;
        case 'toggleSuspension':
          await toggleUserSuspension(selectedUser.id, selectedUser.isSuspended);
          break;
        default:
          break;
      }
    }
    setShowConfirmation(false);
    setConfirmationAction(null);
    setSelectedUser(null);
  };

  const approveUser = async (userId) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isApproved: true });

    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();

      const templateParams = {
        to_email: userData.email,
        to_name: userData.firstname,
      };

      emailjs.send('service_b9pegsb', 'template_smexotg', templateParams, 'GzTrzVDcGGlrFwgAi')
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
        }, (error) => {
          console.error('FAILED...', error);
        });

      setUsers(users.map(user => user.id === userId ? { ...user, isApproved: true } : user));
    }
  };

  const deleteUser = async (userId) => {
    if (currentUser.uid === userId) {
      alert("אינך יכול למחוק את עצמך");
      return;
    }

    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    setUsers(users.filter(user => user.id !== userId));
  };

  const updateUserRole = async (userId, newRole) => {
    if (currentUser.uid === userId && newRole !== 'admin') {
      alert("אינך יכול להחליף את התפקיד שלך לחבר פורומים");
      return;
    }
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: newRole });
    setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
  };

  const toggleUserSuspension = async (userId, isSuspended) => {
    if (currentUser.uid === userId) {
      alert("אינך יכול להשהות את עצמך");
      return;
    }
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isSuspended: !isSuspended });
    setUsers(users.map(user => user.id === userId ? { ...user, isSuspended: !isSuspended } : user));
  };

  const viewUserDetails = (userId) => {
    navigate(`/user-details/${userId}`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.username && user.username.includes(searchTerm)) || (user.email && user.email.includes(searchTerm));
    const matchesDisease = diseaseFilter === 'all' || user.diagnosis === diseaseFilter;
    const matchesApproval = filter === 'all' || (filter === 'approved' && user.isApproved) || (filter === 'pending' && !user.isApproved);
    const matchesSuspension = suspensionFilter === 'all' || (suspensionFilter === 'suspended' && user.isSuspended) || (suspensionFilter === 'active' && !user.isSuspended);
    return matchesSearch && matchesDisease && matchesApproval && matchesSuspension;
  });

  return (
    <div className="manage-users-container">
      <div className="page-header">
        <img src={logo} alt="Logo" className="logo" />
        <h1>ניהול משתמשים</h1>
      </div>
      <div style={{ paddingTop: '20px' }}>
        <div className="filter-buttons">
          <button onClick={() => setFilter('all')}>כל המשתמשים</button>
          <button onClick={() => setFilter('approved')}>משתמשים מאושרים</button>
          <button onClick={() => setFilter('pending')}>משתמשים הממתינים לאישור</button>
        </div>
        <div className="search-and-filter">
          <input
            type="text"
            placeholder="חפש לפי שם משתמש או אימייל"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="wide-input"
          />
          <select value={diseaseFilter} onChange={(e) => setDiseaseFilter(e.target.value)}>
            <option value="all">כל המחלות</option>
            <option value="Crohn">קרוהן</option>
            <option value="Colitis">קוליטיס</option>
          </select>
          <select value={suspensionFilter} onChange={(e) => setSuspensionFilter(e.target.value)}>
            <option value="all">הכל</option>
            <option value="active">משתמשים פעילים</option>
            <option value="suspended">משתמשים מושהים</option>
          </select>
          <button>חיפוש</button>
        </div>
        <ul className="user-list">
          {filteredUsers.map(user => (
            <li key={user.id} className="user-card">
              <div className="user-details">
                <span className="user-username">{user.username}</span>
                <span className="user-email">({user.email})</span>
                <div className="user-role">
                  <strong>תפקיד:</strong>
                  <select
                    value={user.role}
                    onChange={(e) => showConfirmationModal('updateRole', { ...user, newRole: e.target.value })}
                  >
                    <option value="forumMember">חבר פורומים</option>
                    <option value="admin">מנהל</option>
                  </select>
                </div>
                <span className={`user-status ${user.isApproved ? 'approved' : 'pending'}`}>
                  {user.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>
              <div className="user-actions">
                {!user.isApproved &&
                 <button onClick={() => showConfirmationModal('approve', user)} className="approve-btn">אשר משתמש
                 </button>}
                <button onClick={() => showConfirmationModal('toggleSuspension', user)} className="suspend-btn">
                  {user.isSuspended ? 'חידוש משתמש' : 'השהה משתמש'}
                </button>
                <button onClick={() => showConfirmationModal('delete', user)} className="delete-btn">מחק משתמש</button>
                <button onClick={() => viewUserDetails(user.id)} className="details-btn">פרטי משתמש</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {showConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <p>
              {confirmationAction === 'approve' && 'האם לאשר משתמש זה?'}
              {confirmationAction === 'delete' && 'האם למחוק משתמש זה?'}
              {confirmationAction === 'updateRole' && `האם לשנות את תפקיד המשתמש ל-${selectedUser.newRole === 'admin' ? 'מנהל' : 'חבר פורומים'}?`}
              {confirmationAction === 'toggleSuspension' && (selectedUser.isSuspended ? 'האם לחדש משתמש זה?' : 'האם להשהות משתמש זה?')}
            </p>
            <div className="modal-buttons">
              <button onClick={handleConfirmation}>אישור</button>
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

export default ManageUsers;
