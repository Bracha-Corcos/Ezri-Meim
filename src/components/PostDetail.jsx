import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import NewComment from './NewComment';
import './PostDetail.css';

const formatDateTime = (timestamp) => {
  const date = timestamp.toDate();
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  
  const formattedDate = date.toLocaleDateString('en-GB', options);
  const formattedTime = date.toLocaleTimeString('en-GB', timeOptions);
  
  return `${formattedDate} ${formattedTime}`;
};

function PostDetail() {
  const { forumId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [quoteComment, setQuoteComment] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'forums', forumId, 'posts', postId));
        if (postDoc.exists()) {
          setPost(postDoc.data());
        }
      } catch (error) {
        console.error("Error fetching post: ", error);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsSnapshot = await getDocs(collection(db, 'forums', forumId, 'posts', postId, 'comments'));
        const commentsData = commentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments: ", error);
      }
    };

    fetchPost();
    fetchComments();
  }, [forumId, postId]);

  const handleEmojiClick = async (emoji, itemId, isPost) => {
    const itemDocRef = doc(db, 'forums', forumId, 'posts', postId, ...(isPost ? [] : ['comments', itemId]));
    try {
      const itemDoc = await getDoc(itemDocRef);
      const updatedReactions = { ...itemDoc.data().emojiReactions, [emoji]: (itemDoc.data().emojiReactions[emoji] || 0) + 1 };

      await updateDoc(itemDocRef, {
        emojiReactions: updatedReactions,
      });

      if (isPost) {
        setPost((prevPost) => ({
          ...prevPost,
          emojiReactions: updatedReactions,
        }));
      } else {
        setComments((prevComments) => prevComments.map(comment => comment.id === itemId ? { ...comment, emojiReactions: updatedReactions } : comment));
      }
    } catch (error) {
      console.error("Error updating emoji reactions: ", error);
    }
  };

  const handleQuote = (comment) => {
    setQuoteComment(comment);
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  const emojiList = ['😊', '❤️', '👍', '😂','👎','😥']; // Add more emojis as needed

  return (
    <div className="post-container">
      <h1 className="post-title">{post.title}</h1>
      <p className="post-content">{post.content}</p>
      <p className="post-info">יוצר: {post.createdBy}</p>
      <p className="post-info">בתאריך: {post.createdAt && formatDateTime(post.createdAt)}</p>
      <div className="emoji-container">
        {emojiList.map((emoji) => (
          <button key={emoji} onClick={() => handleEmojiClick(emoji, postId, true)}>
            {emoji} {post.emojiReactions?.[emoji] || 0}
          </button>
        ))}
      </div>
      <NewComment postId={postId} onCommentCreated={(newComment) => setComments([...comments, newComment])} quoteComment={quoteComment} />
      {comments.length > 0 && (
        <div className="comments-container">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              {comment.quote && (
                <div className="quote">
                  <p>ציטוט: {comment.quote.text}</p>
                </div>
              )}
              <p>{comment.text}</p>
              <p>יוצר: {comment.createdBy}</p>
              <p>בתאריך: {comment.createdAt && formatDateTime(comment.createdAt)}</p>
              <button onClick={() => handleQuote(comment)}>ציטוט</button>
              <div className="emoji-container">
                {emojiList.map((emoji) => (
                  <button key={emoji} onClick={() => handleEmojiClick(emoji, comment.id, false)}>
                    {emoji} {comment.emojiReactions?.[emoji] || 0}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostDetail;
