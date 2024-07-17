
import React from 'react';

const EventList = ({ events, onDeleteEvent }) => {
  if (events.length === 0) return null;

  return (
    <div>
      <h4>אירועים בתאריך הנבחר</h4>
      {events.map((event, index) => (
        <div key={index} className="EventItem">
          <span>{event.date.toDateString()}: {event.title}</span>
          <button onClick={() => onDeleteEvent(event)}>מחק</button>
        </div>
      ))}
    </div>
  );
};

export default EventList;

