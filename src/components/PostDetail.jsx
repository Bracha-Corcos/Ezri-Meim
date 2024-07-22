import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
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
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [quoteComment, setQuoteComment] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setIsAdmin(userDoc.data()?.role === 'admin');
        console.log('Current user set:', user.uid);
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'forums', forumId, 'posts', postId));
        if (postDoc.exists()) {
          const postData = postDoc.data();
          setPost({
            id: postDoc.id,
            ...postData,
            createdById: postData.createdById || null,
            emojiReactions: postData.emojiReactions || {},
            userReactions: postData.userReactions || {},
          });
          console.log('Post set:', postData);
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
          userReactions: doc.data().userReactions || {},
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
    console.log('Current user:', currentUser);
    console.log('Post:', post);
    console.log('Is admin:', isAdmin);
  }, [currentUser, post, isAdmin]);

  const handleEmojiClick = async (emoji, itemId, isPost) => {
    const itemDocRef = doc(db, 'forums', forumId, 'posts', postId, ...(isPost ? [] : ['comments', itemId]));
    try {
      const itemDoc = await getDoc(itemDocRef);
      const itemData = itemDoc.data();
      const currentReactions = itemData.emojiReactions || {};
      const userReactions = itemData.userReactions || {};

      const userId = auth.currentUser?.uid;
      const hasReacted = userId && userReactions[userId]?.includes(emoji);

      let updatedReactions = { ...currentReactions };
      let updatedUserReactions = { ...userReactions };

      if (hasReacted) {
        updatedReactions[emoji] = Math.max((currentReactions[emoji] || 0) - 1, 0);
        updatedUserReactions[userId] = updatedUserReactions[userId]?.filter(e => e !== emoji) || [];
      } else {
        updatedReactions[emoji] = (currentReactions[emoji] || 0) + 1;
        updatedUserReactions[userId] = [...(userReactions[userId] || []), emoji];
      }

      await updateDoc(itemDocRef, {
        emojiReactions: updatedReactions,
        userReactions: updatedUserReactions,
      });

      if (isPost) {
        setPost(prevPost => ({
          ...prevPost,
          emojiReactions: updatedReactions,
          userReactions: updatedUserReactions,
        }));
      } else {
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === itemId 
              ? { ...comment, emojiReactions: updatedReactions, userReactions: updatedUserReactions } 
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

  const handleDeletePost = async () => {
    console.log('Attempting to delete post');
    console.log('Current user:', currentUser);
    console.log('Post:', post);
    console.log('Is admin:', isAdmin);

    if (!currentUser) {
      console.log("You need to be logged in to delete this post");
      return;
    }

    console.log('currentUser.uid:', currentUser.uid);
    console.log('post.createdById:', post.createdById);

    if (!isAdmin && currentUser.uid !== post.createdById) {
      console.log("You don't have permission to delete this post");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this post and all its comments?");
    if (!confirmDelete) {
      return;
    }

    try {
      // Delete all comments
      const commentsSnapshot = await getDocs(collection(db, 'forums', forumId, 'posts', postId, 'comments'));
      const deleteCommentPromises = commentsSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(deleteCommentPromises);

      // Delete the post
      await deleteDoc(doc(db, 'forums', forumId, 'posts', postId));

      // Navigate back to the forum
      navigate(`/forums/${forumId}`);
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const emojiList = ['😊', '❤️', '👍', '😂', '👎', '😥'];

  const canDeletePost = isAdmin || (currentUser && currentUser.uid === post.createdById);
  console.log('Can delete post:', canDeletePost);

  return (
    <div className="post-container">
      <h1 className="post-title">{post.title}</h1>
      <p className="post-content">{post.content}</p>
      <p className="post-info">יוצר: {post.createdBy}</p>
      <p className="post-info">בתאריך: {post.createdAt && formatDateTime(post.createdAt)}</p>
      <div className="emoji-container">
        {emojiList.map((emoji) => {
          const userId = auth.currentUser?.uid;
          const hasReacted = userId && post.userReactions?.[userId]?.includes(emoji);
          return (
            <button 
              key={emoji} 
              onClick={() => handleEmojiClick(emoji, postId, true)} 
              className={`emoji-button ${hasReacted ? 'reacted' : ''}`}
            >
              {emoji}
              <span className="emoji-count">{post.emojiReactions?.[emoji] || 0}</span>
            </button>
          );
        })}
      </div>
      {post.imageUrl && <img src={post.imageUrl} alt="post" className="post-image" />}
      {canDeletePost && (
        <button onClick={handleDeletePost} className="delete-button">מחק פוסט</button>
      )}
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
                {emojiList.map((emoji) => {
                  const userId = auth.currentUser?.uid;
                  const hasReacted = userId && comment.userReactions?.[userId]?.includes(emoji);
                  return (
                    <button 
                      key={emoji} 
                      onClick={() => handleEmojiClick(emoji, comment.id, false)} 
                      className={`emoji-button ${hasReacted ? 'reacted' : ''}`}
                    >
                      {emoji}
                      <span className="emoji-count">{comment.emojiReactions?.[emoji] || 0}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostDetail;
