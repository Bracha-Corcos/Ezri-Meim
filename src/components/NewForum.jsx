import React, { useState } from 'react';
import { db } from '../firebase';
import { Timestamp, collection, addDoc } from 'firebase/firestore';

function NewForum() {
  const [name, setName] = useState('');
  const [permission, setPermission] = useState(true);
  const manager = "batsheva";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newForum = { name, private: permission, createdAt: Timestamp.now(), createdBy: manager };

    try {
      const collectionRef = collection(db, 'forums');
      const docRef = await addDoc(collectionRef, newForum);
      const newPost = { title: 'פורום חדש', content: '', createdAt: Timestamp.now(), createdBy: manager };
      const postsRef = collection(db, 'forums', docRef.id, 'posts');
      await addDoc(postsRef, newPost);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <h1>יצירת פורום חדש</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">שם:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="permission">פורום פרטי</label>
          <input
            type="checkbox"
            id="permission"
            checked={permission}
            onChange={(e) => setPermission(e.target.checked)}
          />
        </div>
        <button type="submit">אישור</button>
      </form>
    </div>
  );
}

export default NewForum;
