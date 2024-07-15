import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

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
  setEventTime
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Event Modal"
      className="Modal"
      overlayClassName="Overlay"
    >
      <h2>הוספת אירוע</h2>
      <form onSubmit={handleAddEvent}>
        <input
          type="text"
          placeholder="כותרת האירוע"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        <input
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        />
        <button type="submit">הוסף אירוע</button>
      </form>
      <h2>אירועים נבחרים</h2>
      {selectedEvents.map((event, index) => (
        <div key={index} className="eventItem">
          <span>{event.title} - {event.time}</span>
          <button onClick={() => handleEditEvent(index)}>ערוך</button>
          <button onClick={() => handleDeleteEvent(index)}>מחק</button>
        </div>
      ))}
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
  setEventTime: PropTypes.func.isRequired
};

export default EventModal;
