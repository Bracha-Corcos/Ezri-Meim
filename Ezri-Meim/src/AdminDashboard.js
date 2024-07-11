import React, { useState, useEffect } from 'react';
import { db } from './firebase.js';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { sendApprovalEmail } from './emailService.js';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('isApproved', '==', false));
      const querySnapshot = await getDocs(q);
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const approveUser = async (userId) => {
    await updateDoc(doc(db, 'users', userId), {
      isApproved: true
    });
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();
    await sendApprovalEmail(userData.email);
    setUsers(users.filter(user => user.id !== userId));
  };

  const deleteUser = async (userId) => {
    await deleteDoc(doc(db, 'users', userId));
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="admin-dashboard">
      <h2>ניהול משתמשים</h2>
      <table>
        <thead>
          <tr>
            <th>שם משתמש</th>
            <th>אימייל</th>
            <th>תפקיד</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => approveUser(user.id)}>אשר</button>
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

// import React, { useState, useEffect } from 'react';
// import { db } from './firebase.js';
// import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const usersRef = collection(db, 'users');
//       const q = query(usersRef, where('isApproved', '==', false));
//       const querySnapshot = await getDocs(q);
//       const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setUsers(usersList);
//     };

//     fetchUsers();
//   }, []);

//   const approveUser = async (userId) => {
//     await updateDoc(doc(db, 'users', userId), {
//       isApproved: true
//     });
//     // Here you would also send an email to the user
//     setUsers(users.filter(user => user.id !== userId));
//   };

//   const deleteUser = async (userId) => {
//     await deleteDoc(doc(db, 'users', userId));
//     setUsers(users.filter(user => user.id !== userId));
//   };

//   return (
//     <div className="admin-dashboard">
//       <h2>ניהול משתמשים</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>שם משתמש</th>
//             <th>אימייל</th>
//             <th>תפקיד</th>
//             <th>פעולות</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map(user => (
//             <tr key={user.id}>
//               <td>{user.username}</td>
//               <td>{user.email}</td>
//               <td>{user.role}</td>
//               <td>
//                 <button onClick={() => approveUser(user.id)}>אשר</button>
//                 <button onClick={() => deleteUser(user.id)}>מחק</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminDashboard;