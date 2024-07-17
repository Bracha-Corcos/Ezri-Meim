

import { db } from './firebase.js'; // Assuming db is the firestore instance from firebase.js

const eventsCollection = collection(db, 'events');

export const saveEventToFirestore = async (eventData) => {
  const docRef = await addDoc(eventsCollection, eventData);
  return { ...eventData, id: docRef.id };
};

export const updateEventInFirestore = async (eventData) => {
  const eventDocRef = doc(db, 'events', eventData.id);
  await updateDoc(eventDocRef, eventData);
  return eventData;
};

export const deleteEventFromFirestore = async (eventId) => {
  const eventDocRef = doc(db, 'events', eventId);
  await deleteDoc(eventDocRef);
};

export const fetchEventsFromFirestore = async (uid) => {
  const q = query(eventsCollection, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const events = [];
  querySnapshot.forEach((doc) => {
    events.push({ ...doc.data(), id: doc.id });
  });
  return events;
};
