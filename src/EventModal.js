import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './Calendar.css';

const EventModal = ({ isOpen, onRequestClose, eventTitle, setEventTitle, handleAddEvent, selectedEvents, handleDeleteEvent, handleEditEvent, eventTime, setEventTime }) => {
  useEffect(() => {
    if (!isOpen) {
      setEventTime(''); // Reset time when modal closes
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="Modal" overlayClassName="Overlay">
      <h2>הוסף/ערוך אירוע</h2>
      <input
        type="text"
        placeholder="כותרת האירוע"
        value={eventTitle}
        onChange={(e) => setEventTitle(e.target.value)}
      />
      <input
        type="time"
        placeholder="שעה"
        value={eventTime}
        onChange={(e) => setEventTime(e.target.value)}
      />
      <button onClick={handleAddEvent}>שמור</button>
      {selectedEvents.map((event, index) => (
        <div key={index} className="EventItem">
          <span>{event.title} - {event.time}</span>
          <button onClick={() => handleDeleteEvent(event)}>מחק</button>
          <button onClick={() => handleEditEvent(event)}>ערוך</button>
        </div>
      ))}
    </Modal>
  );
};

export default EventModal;
