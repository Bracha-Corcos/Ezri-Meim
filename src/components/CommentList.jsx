import React from 'react';
import '../forums.css';

function CommentList({ comments, onQuote }) {
  return (
    <div>
      <h3>תגובות</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
            {comment.quote && (
              <div style={{ backgroundColor: '#f9f9f9', padding: '10px', margin: '10px 0', borderLeft: '5px solid #ccc' }}>
                <p>ציטוט: {comment.quote.text}</p>
              </div>
            )}
            <p>{comment.text}</p>
            <p>יוצר: {comment.createdBy}</p>
            <p>בתאריך: {comment.createdAt?.toDate().toString()}</p>
            <button onClick={() => onQuote(comment)}>ציטוט</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentList;
