import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function ForumList() {
  const [forums, setForums] = useState([]);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'forums'));
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
  }, []);

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