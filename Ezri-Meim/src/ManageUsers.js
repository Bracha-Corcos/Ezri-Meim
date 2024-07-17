// import React, { useState, useEffect } from 'react';
// import { db, auth } from './firebase.js';
// import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import './style.css'; 
// import logo from './logo.png';

// const ManageUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [roleFilter, setRoleFilter] = useState('all');
//   const navigate = useNavigate();
//   const currentUser = auth.currentUser;

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const usersRef = collection(db, 'users');
//       const querySnapshot = await getDocs(usersRef);
//       const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setUsers(usersList);
//     };

//     fetchUsers();
//   }, []);

//   const approveUser = async (userId) => {
//     const userRef = doc(db, 'users', userId);
//     const confirmApproval = window.confirm("האם אתה בטוח שברצונך לאשר משתמש זה?");
//     if (confirmApproval) {
//       await updateDoc(userRef, { isApproved: true });
//       setUsers(users.map(user => user.id === userId ? { ...user, isApproved: true } : user));
//     }
//   };

//   const deleteUser = async (userId) => {
//     if (currentUser.uid === userId) {
//       alert("אינך יכול למחוק את עצמך");
//       return;
//     }
    
//     const confirmDeletion = window.confirm("האם אתה בטוח שברצונך למחוק משתמש זה?");
//     if (confirmDeletion) {
//       const userRef = doc(db, 'users', userId);
//       await deleteDoc(userRef);
//       setUsers(users.filter(user => user.id !== userId));
//     }
//   };

//   const updateUserRole = async (userId, newRole) => {
//     const userRef = doc(db, 'users', userId);
//     const user = users.find(u => u.id === userId);
//     const confirmChange = window.confirm(`האם אתה בטוח שברצונך להפוך את המשתמש ${user.username} ל-${newRole === 'admin' ? 'מנהל' : 'חבר פורומים'}?`);
//     if (confirmChange) {
//       await updateDoc(userRef, { role: newRole });
//       setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
//     }
//   };

//   const toggleUserSuspension = async (userId, isSuspended) => {
//     const userRef = doc(db, 'users', userId);
//     const user = users.find(u => u.id === userId);
//     const confirmSuspension = window.confirm(`האם אתה בטוח שברצונך ${isSuspended ? 'לחדש' : 'להשהות'} את המשתמש ${user.username}?`);
//     if (confirmSuspension) {
//       await updateDoc(userRef, { isSuspended: !isSuspended });
//       setUsers(users.map(user => user.id === userId ? { ...user, isSuspended: !isSuspended } : user));
//     }
//   };

//   const viewUserDetails = (userId) => {
//     navigate(`/user-details/${userId}`);
//   };

//   const filteredUsers = users.filter(user => {
//     const matchesSearch = user.username.includes(searchTerm) || user.email.includes(searchTerm);
//     const matchesRole = roleFilter === 'all' || user.role === roleFilter;
//     const matchesApproval = filter === 'all' || (filter === 'approved' && user.isApproved) || (filter === 'pending' && !user.isApproved);
//     return matchesSearch && matchesRole && matchesApproval;
//   });

//   return (
//     <div className="manage-users-container">
//       <div className="page-header">
//         <img src={logo} alt="Logo" className="logo" />
//         <h1>ניהול משתמשים</h1>
//       </div>
//       <div style={{ paddingTop: '20px' }}>
//         <div className="filter-buttons">
//           <button onClick={() => setFilter('all')}>כל המשתמשים</button>
//           <button onClick={() => setFilter('approved')}>משתמשמים מאושרים</button>
//           <button onClick={() => setFilter('pending')}>משתמשים הממתינים לאישור</button>
//         </div>
//         <div className="search-and-filter">
//           <input
//             type="text"
//             placeholder="חפש לפי שם משתמש או אימייל"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="wide-input"
//           />
//           <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
//             <option value="all">הכל</option>
//             <option value="forumMember">חבר פורומים</option>
//             <option value="admin">מנהל</option>
//           </select>
//           <button>חיפוש</button>
//         </div>
//         <ul className="user-list">
//           {filteredUsers.map(user => (
//             <li key={user.id} className="user-card">
//               <div className="user-details">
//                 <span className="user-username">{user.username}</span>
//                 <span className="user-email">({user.email})</span>
//                 <div className="user-role">
//                   <strong>תפקיד:</strong>
//                   <select
//                     value={user.role}
//                     onChange={(e) => updateUserRole(user.id, e.target.value)}
//                   >
//                     <option value="forumMember">חבר פורומים</option>
//                     <option value="admin">מנהל</option>
//                   </select>
//                 </div>
//                 <span className={`user-status ${user.isApproved ? 'approved' : 'pending'}`}>
//                   {user.isApproved ? 'Approved' : 'Pending'}
//                 </span>
//               </div>
//               <div className="user-actions">
//                 {!user.isApproved && <button onClick={() => approveUser(user.id)} className="approve-btn">אשר משתמש</button>}
//                 <button onClick={() => toggleUserSuspension(user.id, user.isSuspended)} className="suspend-btn">
//                   {user.isSuspended ? 'חידוש משתמש' : 'השהה משתמש'}
//                 </button>
//                 <button onClick={() => deleteUser(user.id)} className="delete-btn">מחק משתמש</button>
//                 <button onClick={() => viewUserDetails(user.id)} className="details-btn">פרטי משתמש</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default ManageUsers;


import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase.js';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './style.css'; 
import logo from './logo.png';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [suspensionFilter, setSuspensionFilter] = useState('all'); // New state for suspension filter
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

  const approveUser = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const confirmApproval = window.confirm("האם אתה בטוח שברצונך לאשר משתמש זה?");
    if (confirmApproval) {
      await updateDoc(userRef, { isApproved: true });
      setUsers(users.map(user => user.id === userId ? { ...user, isApproved: true } : user));
    }
  };

  const deleteUser = async (userId) => {
    if (currentUser.uid === userId) {
      alert("אינך יכול למחוק את עצמך");
      return;
    }
    
    const confirmDeletion = window.confirm("האם אתה בטוח שברצונך למחוק משתמש זה?");
    if (confirmDeletion) {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const updateUserRole = async (userId, newRole) => {
    if (currentUser.uid === userId && newRole !== 'admin') {
      alert("אינך יכול להחליף את התפקיד שלך לחבר פורומים");
      return;
    }
    const userRef = doc(db, 'users', userId);
    const user = users.find(u => u.id === userId);
    const confirmChange = window.confirm(`האם אתה בטוח שברצונך להפוך את המשתמש ${user.username} ל-${newRole === 'admin' ? 'מנהל' : 'חבר פורומים'}?`);
    if (confirmChange) {
      await updateDoc(userRef, { role: newRole });
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    }
  };

  const toggleUserSuspension = async (userId, isSuspended) => {
    if (currentUser.uid === userId) {
      alert("אינך יכול להשהות את עצמך");
      return;
    }
    const userRef = doc(db, 'users', userId);
    const user = users.find(u => u.id === userId);
    const confirmSuspension = window.confirm(`האם אתה בטוח שברצונך ${isSuspended ? 'לחדש' : 'להשהות'} את המשתמש ${user.username}?`);
    if (confirmSuspension) {
      await updateDoc(userRef, { isSuspended: !isSuspended });
      setUsers(users.map(user => user.id === userId ? { ...user, isSuspended: !isSuspended } : user));
    }
  };

  const viewUserDetails = (userId) => {
    navigate(`/user-details/${userId}`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.includes(searchTerm) || user.email.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesApproval = filter === 'all' || (filter === 'approved' && user.isApproved) || (filter === 'pending' && !user.isApproved);
    const matchesSuspension = suspensionFilter === 'all' || (suspensionFilter === 'suspended' && user.isSuspended) || (suspensionFilter === 'active' && !user.isSuspended);
    return matchesSearch && matchesRole && matchesApproval && matchesSuspension;
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
          <button onClick={() => setFilter('approved')}>משתמשמים מאושרים</button>
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
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">הכל</option>
            <option value="forumMember">חבר פורומים</option>
            <option value="admin">מנהל</option>
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
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
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
                {!user.isApproved && <button onClick={() => approveUser(user.id)} className="approve-btn">אשר משתמש</button>}
                <button onClick={() => toggleUserSuspension(user.id, user.isSuspended)} className="suspend-btn">
                  {user.isSuspended ? 'חידוש משתמש' : 'השהה משתמש'}
                </button>
                <button onClick={() => deleteUser(user.id)} className="delete-btn">מחק משתמש</button>
                <button onClick={() => viewUserDetails(user.id)} className="details-btn">פרטי משתמש</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageUsers;

