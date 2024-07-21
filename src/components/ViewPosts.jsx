import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import '../ViewPosts.css';

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
        const postsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const postId = doc.id;
            const commentsRef = collection(db, 'forums', forumId, 'posts', postId, 'comments');
            const commentsSnapshot = await getDocs(commentsRef);
            const commentsCount = commentsSnapshot.size;
            return {
              id: postId,
              commentsCount,
              ...doc.data(),
            };
          })
        );
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
      setPosts([...posts, { ...newPost, id: docRef.id, commentsCount: 0 }]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  const formatDateTime = (timestamp) => {
    const date = timestamp.toDate();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    
    const formattedDate = date.toLocaleDateString('en-GB', options);
    const formattedTime = date.toLocaleTimeString('en-GB', timeOptions);
    
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div className="forum-container">
      <h1>רשימת הפוסטים:</h1>
      <div className="post-list">
        {posts.map((post) => (
          <Link 
            to={`/forums/${forumId}/posts/${post.id}`}
            key={post.id}
            className="post-item"
          >
            <h2 className="post-title">{post.title}</h2>
            <div className="post-meta">
              <p>יוצר: {post.createdBy}</p>
              <p>בתאריך: {formatDateTime(post.createdAt)}</p>
              <p>תגובות: {post.commentsCount}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="new-post">
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
          <button type="submit">צור פוסט</button>
        </form>
      </div>
    </div>
  );
}

export default ViewPosts;
