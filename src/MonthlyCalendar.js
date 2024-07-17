// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
// import { db } from './firebase.js';
// import EventModal from './EventModal.js';
// import './Calendar.css';

// const dayNames = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
// const monthNames = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

// const MonthlyCalendar = () => {
//   const [date, setDate] = useState(new Date());
//   const [events, setEvents] = useState([]);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [eventTitle, setEventTitle] = useState('');
//   const [eventTime, setEventTime] = useState('');
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedEvents, setSelectedEvents] = useState([]);
//   const [editingEvent, setEditingEvent] = useState(null);
//   const [showAddEvent, setShowAddEvent] = useState(false);

//   useEffect(() => {
//     const q = query(collection(db, 'events'));
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const eventsData = [];
//       querySnapshot.forEach((doc) => {
//         eventsData.push({ ...doc.data(), id: doc.id, date: doc.data().date.toDate() });
//       });
//       setEvents(eventsData);
//     });

//     return () => unsubscribe();
//   }, []);

//   const onDateChange = date => {
//     setDate(date);
//     openModal(date);
//   };

//   const openModal = date => {
//     setSelectedDate(date);
//     const eventsOnDate = events.filter(event => 
//       event.date.toDateString() === date.toDateString()
//     );
//     setSelectedEvents(eventsOnDate);
//     setModalIsOpen(true);
//     setEditingEvent(null);
//     setShowAddEvent(false);
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//     setEventTitle('');
//     setEventTime('');
//     setSelectedDate(null);
//     setSelectedEvents([]);
//     setEditingEvent(null);
//     setShowAddEvent(false);
//   };

//   const handleAddEvent = async () => {
//     if (editingEvent) {
//       const eventDocRef = doc(db, 'events', editingEvent.id);
//       await updateDoc(eventDocRef, {
//         title: eventTitle,
//         time: eventTime
//       });
//       setEditingEvent(null);
//     } else {
//       await addDoc(collection(db, 'events'), {
//         date: selectedDate,
//         title: eventTitle,
//         time: eventTime
//       });
//     }
//     closeModal();
//   };

//   const handleDeleteEvent = async (event) => {
//     const eventDocRef = doc(db, 'events', event.id);
//     await deleteDoc(eventDocRef);
//   };

//   const handleEditEvent = (event) => {
//     setEditingEvent(event);
//     setEventTitle(event.title);
//     setEventTime(event.time);
//     setModalIsOpen(true);
//     setShowAddEvent(true);
//   };

//   const renderTileContent = ({ date, view }) => {
//     if (view === 'month') {
//       const eventsOnDate = events.filter(event => 
//         event.date.toDateString() === date.toDateString()
//       );
//       return (
//         <div className={`calendar-day ${eventsOnDate.length > 0 ? 'has-event' : ''}`}>
//           {eventsOnDate.length > 0 && (
//             <div>
//               <div className="event-indicator"></div>
//               {eventsOnDate.map((event, index) => (
//                 <div key={index} className="event-title">{event.title}</div>
//               ))}
//             </div>
//           )}
//         </div>
//       );
//     }
//   };

//   const formatDate = (locale, date) => {
//     return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
//   };

//   return (
//     <div className="calendar-container">
//       <Calendar
//         onChange={onDateChange}
//         value={date}
//         tileContent={renderTileContent}
//         locale="he-IL"
//         formatMonthYear={formatDate}
//       />
//       <EventModal
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         eventTitle={eventTitle}
//         setEventTitle={setEventTitle}
//         eventTime={eventTime}
//         setEventTime={setEventTime}
//         handleAddEvent={handleAddEvent}
//         selectedEvents={selectedEvents}
//         handleDeleteEvent={handleDeleteEvent}
//         handleEditEvent={handleEditEvent}
//         setSelectedEvents={setSelectedEvents}
//         showAddEvent={showAddEvent}
//         setShowAddEvent={setShowAddEvent}
//       />
//     </div>
//   );
// };

// export default MonthlyCalendar;
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from './firebase.js'; // Import auth to get the current user
import EventModal from './EventModal.js';
import './Calendar.css';

const dayNames = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
const monthNames = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

const MonthlyCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const currentUser = auth.currentUser; // Get the current user

  useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, 'events'), where('userId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const eventsData = [];
        querySnapshot.forEach((doc) => {
          eventsData.push({ ...doc.data(), id: doc.id, date: doc.data().date.toDate() });
        });
        setEvents(eventsData);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const onDateChange = date => {
    setDate(date);
    openModal(date);
  };

  const openModal = date => {
    setSelectedDate(date);
    const eventsOnDate = events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
    setSelectedEvents(eventsOnDate);
    setModalIsOpen(true);
    setEditingEvent(null);
    setShowAddEvent(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEventTitle('');
    setEventTime('');
    setSelectedDate(null);
    setSelectedEvents([]);
    setEditingEvent(null);
    setShowAddEvent(false);
  };

  const handleAddEvent = async () => {
    if (editingEvent) {
      const eventDocRef = doc(db, 'events', editingEvent.id);
      await updateDoc(eventDocRef, {
        title: eventTitle,
        time: eventTime
      });
      setEditingEvent(null);
    } else {
      await addDoc(collection(db, 'events'), {
        date: selectedDate,
        title: eventTitle,
        time: eventTime,
        userId: currentUser.uid // Add the current user's UID
      });
    }
    closeModal();
  };

  const handleDeleteEvent = async (event) => {
    const eventDocRef = doc(db, 'events', event.id);
    await deleteDoc(eventDocRef);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventTitle(event.title);
    setEventTime(event.time);
    setModalIsOpen(true);
    setShowAddEvent(true);
  };

  const renderTileContent = ({ date, view }) => {
    if (view === 'month') {
      const eventsOnDate = events.filter(event => 
        event.date.toDateString() === date.toDateString()
      );
      return (
        <div className={`calendar-day ${eventsOnDate.length > 0 ? 'has-event' : ''}`}>
          {eventsOnDate.length > 0 && (
            <div>
              <div className="event-indicator"></div>
              {eventsOnDate.map((event, index) => (
                <div key={index} className="event-title">{event.title}</div>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  const formatDate = (locale, date) => {
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={onDateChange}
        value={date}
        tileContent={renderTileContent}
        locale="he-IL"
        formatMonthYear={formatDate}
      />
      <EventModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        eventTitle={eventTitle}
        setEventTitle={setEventTitle}
        eventTime={eventTime}
        setEventTime={setEventTime}
        handleAddEvent={handleAddEvent}
        selectedEvents={selectedEvents}
        handleDeleteEvent={handleDeleteEvent}
        handleEditEvent={handleEditEvent}
        setSelectedEvents={setSelectedEvents}
        showAddEvent={showAddEvent}
        setShowAddEvent={setShowAddEvent}
      />
    </div>
  );
};

export default MonthlyCalendar;
