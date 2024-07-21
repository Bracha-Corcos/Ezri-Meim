import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import NewComment from './NewComment';
import './PostDetail.css';

const formatDateTime = (timestamp) => {
  if (!timestamp || !timestamp.toDate) {
    return 'Invalid date';
  }
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
          const postData = postDoc.data();
          setPost({
            ...postData,
            emojiReactions: postData.emojiReactions || {},
          });
        } else {
          console.log("No such post!");
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
          emojiReactions: doc.data().emojiReactions || {},
        }));
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments: ", error);
      }
    };

    fetchPost();
    fetchComments();
  }, [forumId, postId]);

  useEffect(() => {
    console.log("Post updated:", post);
  }, [post]);

  useEffect(() => {
    console.log("Comments updated:", comments);
  }, [comments]);

  const handleEmojiClick = async (emoji, itemId, isPost) => {
    const itemDocRef = doc(db, 'forums', forumId, 'posts', postId, ...(isPost ? [] : ['comments', itemId]));
    try {
      const itemDoc = await getDoc(itemDocRef);
      const itemData = itemDoc.data();
      const currentReactions = itemData.emojiReactions || {};
      const updatedReactions = { ...currentReactions, [emoji]: (currentReactions[emoji] || 0) + 1 };

      await updateDoc(itemDocRef, {
        emojiReactions: updatedReactions,
      });

      if (isPost) {
        setPost((prevPost) => ({
          ...prevPost,
          emojiReactions: updatedReactions,
        }));
      } else {
        setComments((prevComments) => 
          prevComments.map(comment => 
            comment.id === itemId 
              ? { ...comment, emojiReactions: updatedReactions } 
              : comment
          )
        );
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

  const emojiList = ['😊', '❤️', '👍', '😂', '👎', '😥'];

  return (
    <div className="post-container">
      <h1 className="post-title">{post.title}</h1>
      <p className="post-content">{post.content}</p>
      <p className="post-info">יוצר: {post.createdBy}</p>
      <p className="post-info">בתאריך: {post.createdAt && formatDateTime(post.createdAt)}</p>
      <div className="emoji-container">
        {emojiList.map((emoji) => (
          <button 
            key={emoji} 
            onClick={() => handleEmojiClick(emoji, postId, true)} 
            className="emoji-button"
          >
            {emoji} <span className="emoji-count">{post.emojiReactions?.[emoji] || 0}</span>
          </button>
        ))}
      </div>
      {post.imageUrl && <img src={post.imageUrl} alt="post" className="post-image" />}
      <NewComment 
        postId={postId} 
        onCommentCreated={(newComment) => setComments([...comments, newComment])} 
        quoteComment={quoteComment} 
      />
      {comments.length > 0 && (
        <div className="comments-container">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              {comment.quote && (
                <div className="quote">
                  <p>ציטוט: {comment.quote.text}</p>
                </div>
              )}
              <p><strong>{comment.createdBy}:</strong> {comment.text}</p>
              {comment.imageUrl && <img src={comment.imageUrl} alt="comment" className="comment-image" />}
              <button onClick={() => handleQuote(comment)} className="quote-button">
                <span className="quote-icon">❝</span> ציטוט
              </button>
              <div className="emoji-container">
                {emojiList.map((emoji) => (
                  <button 
                    key={emoji} 
                    onClick={() => handleEmojiClick(emoji, comment.id, false)} 
                    className="emoji-button"
                  >
                    {emoji} <span className="emoji-count">{comment.emojiReactions?.[emoji] || 0}</span>
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