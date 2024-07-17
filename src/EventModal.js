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
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Event Modal"
      className="Modal"
      overlayClassName="Overlay"
    >
      {/* <h2>אירועים בתאריך הנבחר</h2> */}
      <div className="event-list">
        {selectedEvents.map((event, index) => (
          <div key={index} className="event-item">
            <span className="event-name">{event.title}</span>
            <span>{event.time}</span>
            <div className="button-container">
              <button onClick={() => handleEdit(index)} className="styled-button edit">ערוך</button>
              <button onClick={() => handleDelete(index)} className="styled-button">מחק</button>
            </div>
          </div>
        ))}
      </div>
      {!showAddEvent && (
        <button onClick={() => setShowAddEvent(true)} className="small-button">
          הוסף אירוע
        </button>
      )}
      {showAddEvent && (
        <>
          {/* <h2>הוספת אירוע</h2> */}
          <form onSubmit={(e) => { e.preventDefault(); handleAddEvent(); }}>
            <input
              type="text"
              placeholder="כותרת האירוע"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="event-input"
            />
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="event-input"
            />
            <button type="submit" className="small-button">אישור</button>
          </form>
        </>
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