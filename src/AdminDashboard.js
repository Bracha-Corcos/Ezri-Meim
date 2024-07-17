import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase.js'; // ודא שהנתיב נכון
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import emailjs from 'emailjs-com';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(db, 'users');
      let q = usersRef;
      if (filter !== 'all') {
        q = query(usersRef, where('isApproved', '==', filter === 'approved'));
      }
      if (statusFilter !== 'all') {
        q = query(usersRef, where('isSuspended', '==', statusFilter === 'suspended'));
      }
      const querySnapshot = await getDocs(q);
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, [filter, statusFilter]);

  const approveUser = async (userId) => {
    console.log('Approving user:', userId);
    try {
      await updateDoc(doc(db, 'users', userId), { isApproved: true });
      console.log('User approved in Firestore');

      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User data:', userData);

        const templateParams = {
          to_email: userData.email,
          to_name: userData.firstname,
        };

        console.log('Sending email with params:', templateParams);

        emailjs.send('service_b9pegsb', 'template_smexotg', templateParams, 'GzTrzVDcGGlrFwgAi')
          .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
          }, (error) => {
            console.error('FAILED...', error);
          });

        setUsers(users.filter(user => user.id !== userId));
      } else {
        console.error('No such user!');
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (currentUser.uid === userId) {
      alert("אינך יכול למחוק את עצמך");
      return;
    }

    await deleteDoc(doc(db, 'users', userId));
    setUsers(users.filter(user => user.id !== userId));
  };

  const updateUserRole = async (userId, newRole) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: newRole });
    setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
  };

  const suspendUser = async (userId) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isSuspended: true });
    setUsers(users.map(user => user.id === userId ? { ...user, isSuspended: true } : user));
  };

  const activateUser = async (userId) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isSuspended: false });
    setUsers(users.map(user => user.id === userId ? { ...user, isSuspended: false } : user));
  };

  return (
    <div className="admin-dashboard">
      <h2>ניהול משתמשים</h2>
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>כל המשתמשים</button>
        <button onClick={() => setFilter('approved')}>משתמשים מאושרים</button>
        <button onClick={() => setFilter('pending')}>משתמשים הממתינים לאישור</button>
        <button onClick={() => setStatusFilter('all')}>כל המצבים</button>
        <button onClick={() => setStatusFilter('active')}>משתמשים פעילים</button>
        <button onClick={() => setStatusFilter('suspended')}>משתמשים מושהים</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>שם משתמש</th>
            <th>אימייל</th>
            <th>תפקיד</th>
            <th>מצב</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                >
                  <option value="forumMember">חבר פורומים</option>
                  <option value="admin">מנהל</option>
                </select>
              </td>
              <td>{user.isSuspended ? 'מושהה' : 'פעיל'}</td>
              <td>
                {!user.isApproved && <button onClick={() => {
                  console.log('Approve button clicked for user:', user.id);
                  approveUser(user.id);
                }}>אשר</button>}
                {user.isSuspended ? (
                  <button onClick={() => activateUser(user.id)}>חידוש משתמש</button>
                ) : (
                  <button onClick={() => suspendUser(user.id)}>השהה משתמש</button>
                )}
                <button onClick={() => deleteUser(user.id)}>מחק</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
