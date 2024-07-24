import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import './PostDetail.css';

const formatDateTime = (timestamp) => {
  if (!timestamp || !timestamp.toDate) {
    return 'Invalid date';
  }
  const date = timestamp.toDate();
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('en-GB', options);
};

function CommentQuotes() {
  const { forumId, postId, commentId } = useParams();
  const [comment, setComment] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [newQuote, setNewQuote] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [expandedQuotes, setExpandedQuotes] = useState({});
  const newQuoteFormRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const commentDoc = await getDoc(doc(db, 'forums', forumId, 'posts', postId, 'comments', commentId));
        if (commentDoc.exists()) {
          const commentData = commentDoc.data();
          setComment({ 
            id: commentDoc.id, 
            ...commentData,
            createdBy: forumId === 'general' ? 'user' : commentData.createdBy
          });
        } else {
          console.log("No such comment!");
        }
      } catch (error) {
        console.error("Error fetching comment: ", error);
      }
    };

    const fetchQuotes = async () => {
      try {
        const quotesSnapshot = await getDocs(collection(db, 'forums', forumId, 'posts', postId, 'comments', commentId, 'quotes'));
        const quotesData = quotesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdBy: forumId === 'general' ? 'user' : doc.data().createdBy,
          emojiReactions: doc.data().emojiReactions || {},
          userReactions: doc.data().userReactions || {},
        }));
        setQuotes(quotesData);
      } catch (error) {
        console.error("Error fetching quotes: ", error);
      }
    };

    fetchComment();
    fetchQuotes();
  }, [forumId, postId, commentId]);

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      console.log("You need to be logged in to add a quote");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const username = forumId === 'general' ? 'user' : userDoc.data().username;

      const newQuoteData = {
        text: newQuote,
        createdAt: new Date(),
        createdBy: username,
        createdById: currentUser.uid,
        emojiReactions: {},
        userReactions: {},
        replyTo: replyTo ? replyTo.id : null,
      };

      const quoteRef = await addDoc(collection(db, 'forums', forumId, 'posts', postId, 'comments', commentId, 'quotes'), newQuoteData);
      setQuotes([{ id: quoteRef.id, ...newQuoteData }, ...quotes]);
      setNewQuote('');
      setReplyTo(null);
    } catch (error) {
      console.error("Error adding quote: ", error);
    }
  };

  const handleEmojiClick = async (emoji, quoteId) => {
    const quoteDocRef = doc(db, 'forums', forumId, 'posts', postId, 'comments', commentId, 'quotes', quoteId);
    try {
      const quoteDoc = await getDoc(quoteDocRef);
      const quoteData = quoteDoc.data();
      const currentReactions = quoteData.emojiReactions || {};
      const userReactions = quoteData.userReactions || {};

      const userId = currentUser?.uid;
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

      await updateDoc(quoteDocRef, {
        emojiReactions: updatedReactions,
        userReactions: updatedUserReactions,
      });

      setQuotes(prevQuotes => 
        prevQuotes.map(quote => 
          quote.id === quoteId 
            ? { ...quote, emojiReactions: updatedReactions, userReactions: updatedUserReactions } 
            : quote
        )
      );
    } catch (error) {
      console.error("Error updating emoji reactions: ", error);
    }
  };

  const handleReply = (quote) => {
    setReplyTo(quote);
    setNewQuote(`@${quote.createdBy} `);
    
    if (newQuoteFormRef.current) {
      newQuoteFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleExpand = (quoteId) => {
    setExpandedQuotes(prev => ({ ...prev, [quoteId]: !prev[quoteId] }));
  };

  if (!comment) {
    return <div>Loading...</div>;
  }

  const emojiList = ['😊', '❤️', '👍', '😂', '👎', '😥'];

  const renderQuote = (quote, depth = 0) => {
    const replies = quotes.filter(q => q.replyTo === quote.id);
    const isExpanded = expandedQuotes[quote.id];

    return (
      <div key={quote.id} className={`quote ${depth > 0 ? 'reply' : ''}`}>
        <div className="quote-content">
          {quote.replyTo && (
            <div className="replied-to">
              משיב ל: <strong>{quotes.find(q => q.id === quote.replyTo)?.createdBy}</strong>
            </div>
          )}
          <p><strong>{quote.createdBy}:</strong> {quote.text}</p>
          <p className="quote-info">תאריך: {formatDateTime(quote.createdAt)}</p>
        </div>
        <div className="quote-actions">
          <button onClick={() => handleReply(quote)} className="reply-button">
            תגובה
          </button>
          <div className="emoji-container">
            {emojiList.map((emoji) => {
              const reactionCount = Object.values(quote.userReactions || {}).flat().filter(e => e === emoji).length;
              const hasReacted = currentUser?.uid && quote.userReactions?.[currentUser.uid]?.includes(emoji);
              return (
                <button 
                  key={emoji} 
                  onClick={() => handleEmojiClick(emoji, quote.id)} 
                  className={`emoji-button ${hasReacted ? 'reacted' : ''}`}
                >
                  {emoji}
                  <span className="emoji-count">{reactionCount}</span>
                </button>
              );
            })}
          </div>
        </div>
        {replies.length > 0 && (
          <div className="replies-section">
            <button onClick={() => toggleExpand(quote.id)} className="expand-button">
              {isExpanded ? 'הסתר תגובה' : `הראה תגובות (${replies.length})`}
            </button>
            {isExpanded && (
              <div className="replies">
                {replies.map(reply => renderQuote(reply, depth + 1))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="comment-quotes-container">
      <h2>ציטוטים לתגובה</h2>
      <div className="original-comment">
        <p><strong>{comment.createdBy}:</strong> {comment.text}</p>
        <p className="comment-info">תאריך: {formatDateTime(comment.createdAt)}</p>
      </div>
      <form ref={newQuoteFormRef} onSubmit={handleSubmitQuote} className="new-quote-form">
        {replyTo && (
          <div className="replying-to">
            <p>הגב ל: <strong>{replyTo.createdBy}</strong></p>
            <button onClick={() => setReplyTo(null)} type="button">Cancel</button>
          </div>
        )}
        <textarea
          value={newQuote}
          onChange={(e) => setNewQuote(e.target.value)}
          placeholder="הוסף ציטוט חדש"
          required
        />
        <button type="submit">הוסף ציטוט</button>
      </form>
      <div className="quotes-list">
        {quotes.filter(quote => !quote.replyTo).map(quote => renderQuote(quote))}
      </div>
    </div>
  );
}

export default CommentQuotes;