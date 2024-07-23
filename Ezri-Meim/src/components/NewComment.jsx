import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../forums.css';

function NewComment({ postId, onCommentCreated, quoteComment }) {
  const { forumId } = useParams();
  const [text, setText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Fetch username from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : null;
        if (userData) {
          setUsername(userData.username);
        }
      } else {
        setCurrentUser(null);
        setUsername('');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !username) {
      console.error("No user is currently logged in or username not found.");
      return;
    }

    const newComment = {
      text,
      createdAt: Timestamp.now(),
      createdBy: username, // Use the fetched username
      quote: quoteComment
        ? { text: quoteComment.text, createdBy: quoteComment.createdBy }
        : null,
      emojiReactions: {}, // Initialize emojiReactions field
    };

    try {
      const commentsRef = collection(db, 'forums', forumId, 'posts', postId, 'comments');
      const docRef = await addDoc(commentsRef, newComment);
      onCommentCreated({ ...newComment, id: docRef.id });
      setText('');
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <div>
      {quoteComment && quoteComment.text && (
        <div className="quote-comment">
          <p>ציטוט: {quoteComment.text}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="text">הגב:</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className='replying-to'
          />
        </div>
        <button type="submit" className="submit-button">אישור</button>
      </form>
    </div>
  );
}

export default NewComment;