// export default EventModal;

import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import './Calendar.css';

const EventModal = ({
  isOpen,
  onRequestClose,
  eventTitle,
  setEventTitle,
  handleAddEvent,
  selectedEvents,
  handleDeleteEvent,
  handleEditEvent,
  eventTime,
  setEventTime,
  setSelectedEvents,
  showAddEvent,
  setShowAddEvent,
}) => {
  const handleDelete = (index) => {
    handleDeleteEvent(selectedEvents[index]);
    const updatedEvents = selectedEvents.filter((event, idx) => idx !== index);
    setSelectedEvents(updatedEvents);
  };

  const handleEdit = (index) => {
    handleEditEvent(selectedEvents[index]);
    const updatedEvents = selectedEvents.filter((event, idx) => idx !== index);
    setSelectedEvents(updatedEvents);
    setShowAddEvent(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Event Modal"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>אירועים</h2>
      {selectedEvents.map((event, index) => (
        <div key={index} className="event">
          <p>{event.title} - {event.time}</p>
          <button className="delete-button" onClick={() => handleDelete(index)}>מחק</button>
          <button className="edit-button" onClick={() => handleEdit(index)}>ערוך</button>
        </div>
      ))}
      {showAddEvent ? (
        <div>
          <h3>הוסף אירוע</h3>
          <input
            type="text"
            placeholder="כותרת"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <input
            type="time"
            placeholder="שעה"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
          />
          <button className="add-button" onClick={handleAddEvent}>הוסף אירוע</button>
        </div>
      ) : (
        <button className="add-event-button" onClick={() => setShowAddEvent(true)}>הוסף אירוע חדש</button>
      )}
      <button className="close-button" onClick={onRequestClose}>סגור</button>
    </Modal>
  );
};

EventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  eventTitle: PropTypes.string.isRequired,
  setEventTitle: PropTypes.func.isRequired,
  handleAddEvent: PropTypes.func.isRequired,
  selectedEvents: PropTypes.array.isRequired,
  handleDeleteEvent: PropTypes.func.isRequired,
  handleEditEvent: PropTypes.func.isRequired,
  eventTime: PropTypes.string.isRequired,
  setEventTime: PropTypes.func.isRequired,
  setSelectedEvents: PropTypes.func.isRequired,
  showAddEvent: PropTypes.bool.isRequired,
  setShowAddEvent: PropTypes.func.isRequired,
};

export default EventModal;
