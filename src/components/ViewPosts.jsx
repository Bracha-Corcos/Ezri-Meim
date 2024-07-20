import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

function ViewPosts() {
  const { forumId } = useParams();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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
    const newPost = { title, content, createdAt: Timestamp.now(), createdBy: 'currentUser' };

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

  const formatDateTime = (timestamp) => {
    const date = timestamp.toDate();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    const formattedDate = date.toLocaleDateString('en-GB', options);
    const formattedTime = date.toLocaleTimeString('en-GB', timeOptions);
    
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div>
      <h1>פוסטים:</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: '4px solid red',
              padding: '10px',
              boxSizing: 'border-box',
            }}
          >
            <h2>
              <Link to={`/forums/${forumId}/posts/${post.id}`}>{post.title}</Link>
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2em' }}>
              <p>יוצר: {post.createdBy}</p>
              <p>בתאריך: {formatDateTime(post.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2>פוסט חדש</h2>
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

export default ViewPosts;
