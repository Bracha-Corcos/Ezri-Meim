import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../forums.css';

function ForumPosts() {
  const { forumId } = useParams();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'forums', forumId, 'posts');
        const querySnapshot = await getDocs(postsRef);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, [forumId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      console.error("No user is currently logged in.");
      return;
    }

    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.exists() ? userDoc.data() : null;
    
    if (!userData) {
      console.error("User data not found.");
      return;
    }

    const newPost = {
      title,
      content,
      createdAt: Timestamp.now(),
      createdBy: userData.username,
      createdById: currentUser.uid, // Ensure createdById is set
      openToEdit: true,
      comments: [],
      emojiReactions: {}, // Initialize emojiReactions field
    };

    try {
      const postsRef = collection(db, 'forums', forumId, 'posts');
      const docRef = await addDoc(postsRef, newPost);
      setPosts([...posts, { ...newPost, id: docRef.id }]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  return (
    <div>
      <h1>רשימת פוסטים</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>יוצר: {post.createdBy}</p>
            <p>בתאריך: {post.createdAt.toDate().toString()}</p>
          </li>
        ))}
      </ul>
      <div>
        <h2>יצירת פוסט חדש</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">כותרת:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="content">תוכן:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button type="submit">אישור</button>
        </form>
      </div>
    </div>
  );
}

export default ForumPosts;
