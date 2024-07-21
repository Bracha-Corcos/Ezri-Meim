import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import '../forums.css';

function NewComment({ postId, onCommentCreated, quoteComment }) {
  const { forumId } = useParams();
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComment = {
      text,
      createdAt: Timestamp.now(),
      createdBy: 'currentUser', // Replace with actual user data
      quote: quoteComment ? { text: quoteComment.text, createdBy: quoteComment.createdBy } : null,
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
      {quoteComment && (
        <div style={{ backgroundColor: '#f9f9f9', padding: '10px', marginBottom: '10px', borderLeft: '5px solid #ccc' }}>
          <p>ציטוט: {quoteComment.text}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="text">תגובה:</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <button type="submit">אישור</button>
      </form>
    </div>
  );
}

export default NewComment;
