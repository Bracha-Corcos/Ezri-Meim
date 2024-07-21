import React from 'react';
import '../forums.css';

function CommentList({ comments, onQuote }) {
  return (
    <div>
      <h3>תגובות</h3>
      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            {comment.quote && (
              <div className="comment-quote">
                <p>ציטוט: {comment.quote.text}</p>
              </div>
            )}
            <p className="comment-text">{comment.text}</p>
            <p className="comment-author">יוצר: {comment.createdBy}</p>
            <p className="comment-date">בתאריך: {comment.createdAt?.toDate().toString()}</p>
            <button className="quote-button" onClick={() => onQuote(comment)}>ציטוט</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentList;
