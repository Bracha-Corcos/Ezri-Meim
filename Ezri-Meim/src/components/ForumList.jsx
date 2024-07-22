import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, doc, getCountFromServer } from 'firebase/firestore';
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
          forumsQuery = query(collection(db, 'forums'), where('private', '==', false));
        }
      }

      try {
        const querySnapshot = await getDocs(forumsQuery);
        const forumsData = await Promise.all(querySnapshot.docs.map(async doc => {
          const postsCount = await getCountFromServer(collection(db, 'forums', doc.id, 'posts'));
          return {
            id: doc.id,
            ...doc.data(),
            postsCount: postsCount.data().count
          };
        }));
        setForums(forumsData);
      } catch (error) {
        console.error("Error fetching forums: ", error);
      }
    };

    fetchForums();
  }, [location, isAdmin]);

  return (
    <div className="forum-list-container">
      <h1 className="forum-list-title">הפורומים שלך</h1>
      <ul className="forum-list">
        {forums.map((forum) => (
          <li key={forum.id} className="forum-item">
            <Link to={`/forums/${forum.id}`} className="forum-link">
              <h2 className="forum-name">
                {forum.name}
                {isAdmin && forum.private && <span className="forum-private-tag">פרטי</span>}
              </h2>
              {forum.description && <p className="forum-description">{forum.description}</p>}
              <div className="forum-stats">
                <span>{forum.postsCount} פוסטים</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ForumList;
