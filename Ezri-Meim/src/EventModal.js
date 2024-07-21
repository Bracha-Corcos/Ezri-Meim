
import React, { useState } from 'react';
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
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const handleDelete = (index) => {
    setEventToDelete(selectedEvents[index]);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      handleDeleteEvent(eventToDelete);
      const updatedEvents = selectedEvents.filter(event => event !== eventToDelete);
      setSelectedEvents(updatedEvents);
      setShowDeleteConfirmation(false);
      setEventToDelete(null);
    }
  };

  const handleEdit = (index) => {
    handleEditEvent(selectedEvents[index]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (eventTitle.trim() === '') {
      setErrorMessage('חייב להזין כותרת אירוע');
    } else {
      setErrorMessage('');
      handleAddEvent();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="Modal"
      overlayClassName="Overlay"
    >
      {selectedEvents.map((event, index) => (
        <div key={index} className="event-item">
          <div>
            <span className="event-name">{event.title}</span>
            <span>{event.time}</span>
          </div>
          <div className="button-container">
            <button onClick={() => handleEdit(index)} className="styled-button edit">ערוך</button>
            <button onClick={() => handleDelete(index)} className="styled-button">מחק</button>
          </div>
        </div>
      ))}

      {!showAddEvent && (
        <button onClick={() => setShowAddEvent(true)} className="small-button">
          הוסף אירוע
        </button>
      )}

      {showAddEvent && (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="כותרת האירוע"
              className="event-input"
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="event-input"
            />
            <button type="submit">אישור</button>
          </form>
        </>
      )}

      {showDeleteConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <p>האם אתה בטוח שאתה רוצה למחוק אירוע זה?</p>
            <div className="modal-buttons">
              <button onClick={confirmDelete}>אישור</button>
              <button onClick={() => setShowDeleteConfirmation(false)}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

EventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  eventTitle: PropTypes.string.isRequired,
  setEventTitle: PropTypes.func.isRequired,
  handleAddEvent: PropTypes.func.isRequired,
  selectedEvents: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired
    })
  ).isRequired,
  handleDeleteEvent: PropTypes.func.isRequired,
  handleEditEvent: PropTypes.func.isRequired,
  eventTime: PropTypes.string.isRequired,
  setEventTime: PropTypes.func.isRequired,
  setSelectedEvents: PropTypes.func.isRequired,
  showAddEvent: PropTypes.bool.isRequired,
  setShowAddEvent: PropTypes.func.isRequired,
};

export default EventModal;