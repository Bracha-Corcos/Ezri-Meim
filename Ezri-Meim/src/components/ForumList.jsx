// // import React, { useEffect, useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import { db } from '../firebase';
// // import { collection, getDocs } from 'firebase/firestore';

// // function ForumList() {
// //   const [forums, setForums] = useState([]);

// //   useEffect(() => {
// //     const fetchForums = async () => {
// //       try {
// //         const querySnapshot = await getDocs(collection(db, 'forums'));

// //         const forumsData = querySnapshot.docs.map(doc => ({
// //           id: doc.id,
// //           ...doc.data(),
// //         }));
// //         setForums(forumsData);
// //       } catch (error) {
// //         console.error("Error fetching forums: ", error);
// //       }
// //     };

// //     fetchForums();
// //   }, []);

// //   return (
// //     <div>
// //       <h1>פורומים</h1>
// //       <ul>
// //         {forums.map((forum) => (
// //           <li key={forum.id}>
// //             <h2><Link to={`/forums/${forum.id}`}>{forum.name}</Link></h2>
// //             <p>{forum.private ? "Private" : "Public"}</p>
// //             <p>יוצר: {forum.createdBy}</p>
// //             <p>בתאריך: {forum.createdAt?.toDate().toString()}</p>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }

// // export default ForumList;

// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { db } from '../firebase';
// import { collection, getDocs, query, where } from 'firebase/firestore';

// function ForumList() {
//   const [forums, setForums] = useState([]);
//   const [isPrivate, setIsPrivate] = useState(false); // Add state to toggle between private and public

//   useEffect(() => {
//     const fetchForums = async () => {
//       try {
//         // Create a query to filter documents based on the private field
//         const q = query(collection(db, 'forums'), where('private', '==', isPrivate));
//         const querySnapshot = await getDocs(q);
        
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
//   }, [isPrivate]); // Add isPrivate as a dependency to re-fetch data when it changes

//   return (
//     <div>
//       <h1>פורומים</h1>
//       <button onClick={() => setIsPrivate(!isPrivate)}>
//         Show {isPrivate ? "Public" : "Private"} Forums
//       </button>
//       <ul>
//         {forums.map((forum) => (
//           <li key={forum.id}>
//             <h2><Link to={`/forums/${forum.id}`}>{forum.name}</Link></h2>
//             <p>{forum.private ? "Private" : "Public"}</p>
//             <p>יוצר: {forum.createdBy}</p>
//             <p>בתאריך: {forum.createdAt?.toDate().toString()}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default ForumList;
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

function ForumList() {
  const [forums, setForums] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchForums = async () => {
      const params = new URLSearchParams(location.search);
      const type = params.get('type');
      const subtype = params.get('subtype');
      let forumsQuery;

      if (type === 'general') {
        forumsQuery = query(collection(db, 'forums'), where('private', '==', false));
      } else if (type === 'personal') {
        forumsQuery = query(collection(db, 'forums'), where('private', '==', true));
        if (subtype) {
          forumsQuery = query(forumsQuery, where('subtype', '==', subtype));
        }
      } else {
        forumsQuery = query(collection(db, 'forums'));
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
  }, [location]);

  return (
    <div>
      <h1>פורומים</h1>
      <ul>
        {forums.map((forum) => (
          <li key={forum.id}>
            <h2><Link to={`/forums/${forum.id}`}>{forum.name}</Link></h2>
            <p>{forum.private ? "Private" : "Public"}</p>
            <p>יוצר: {forum.createdBy}</p>
            <p>בתאריך: {forum.createdAt?.toDate().toString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ForumList;
