// import React, { useEffect, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { db } from '../firebase';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import '../forums.css';

// function ForumList() {
//   const [forums, setForums] = useState([]);
//   const location = useLocation();

//   useEffect(() => {
//     const fetchForums = async () => {
//       const params = new URLSearchParams(location.search);
//       const type = params.get('type');
//       const subtype = params.get('subtype');
//       let forumsQuery;
//       if (type === 'general') {
//         forumsQuery = query(collection(db, 'forums'), where('private', '==', false));
//       } else if (type === 'personal') {
//         forumsQuery = query(collection(db, 'forums'), where('private', '==', true));
//         if (subtype) {
//           forumsQuery = query(forumsQuery, where('subtype', '==', subtype));
//         }
//       } else {
//         forumsQuery = query(collection(db, 'forums'));
//       }

//       try {
//         const querySnapshot = await getDocs(forumsQuery);
//         const forumsData = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setForums(forumsData);
//       } catch (error) {
//         console.error("Error fetching forums: ", error);
//       }
//     };

//     fetchForums();
//   }, [location]);

//   return (
//     <div className=''>
//       <ul>
//         {forums.map((forum) => (
//           <li key={forum.id}>
//             <h1>הפורומים שלך:</h1>
//             <button><Link to={`/forums/${forum.id}`}>{forum.name}</Link></button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default ForumList;

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import '../forums.css';

function ForumList() {
  const [forums, setForums] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          setIsAdmin(userData.role === 'admin');
        }
      }
    };

    checkAdminStatus();
  }, []);

  useEffect(() => {
    const fetchForums = async () => {
      const params = new URLSearchParams(location.search);
      const type = params.get('type');
      let forumsQuery;

      if (isAdmin) {
        if (type === 'general') {
          forumsQuery = query(collection(db, 'forums'), where('private', '==', false));
        } else if (type === 'personal') {
          forumsQuery = query(collection(db, 'forums'), where('private', '==', true));
        } else {
          // אם לא נבחר סוג, נציג את כל הפורומים למנהל
          forumsQuery = query(collection(db, 'forums'));
        }
      } else {
        if (type === 'general') {
          forumsQuery = query(collection(db, 'forums'), where('private', '==', false));
        } else if (type === 'personal') {
          const subtype = params.get('subtype');
          forumsQuery = query(collection(db, 'forums'), where('private', '==', true));
          if (subtype) {
            forumsQuery = query(forumsQuery, where('subtype', '==', subtype));
          }
        } else {
          // אם לא נבחר סוג, נציג רק את הפורומים הכלליים למשתמש רגיל
          forumsQuery = query(collection(db, 'forums'), where('private', '==', false));
        }
      }

      try {
        const querySnapshot = await getDocs(forumsQuery);
        const forumsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setForums(forumsData);
      } catch (error) {
        console.error("Error fetching forums: ", error);
      }
    };

    fetchForums();
  }, [location, isAdmin]);

  return (
    <div className='forum-list'>
      <h1>הפורומים שלך:</h1>
      <ul>
        {forums.map((forum) => (
          <li key={forum.id}>
            <button>
              <Link to={`/forums/${forum.id}`}>{forum.name}</Link>
            </button>
            {isAdmin && forum.private && <span> (פרטי)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ForumList;