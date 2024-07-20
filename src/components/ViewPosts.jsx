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

  return (
    <div>
      <h1>פוסטים:
      </h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>
              <Link to={`/forums/${forumId}/posts/${post.id}`}>{post.title}</Link>
            </h2>
            {/* <p>{post.content}</p> */}
            <p>יוצר: {post.createdBy}</p>
            <p>בתאריך: {post.createdAt?.toDate().toString()}</p>
          </li>
        ))}
      </ul>
      <div>
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
