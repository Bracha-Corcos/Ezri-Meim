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
    <div className=''>
      <ul>
        {forums.map((forum) => (
          <li key={forum.id}>
            <h1>הפורומים שלך:</h1>
            <button><Link to={`/forums/${forum.id}`}>{forum.name}</Link></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ForumList;
