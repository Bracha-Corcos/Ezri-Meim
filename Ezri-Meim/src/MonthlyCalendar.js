import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './style.css';
import EventModal from './EventModal.js';

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

  const onDateChange = date => setDate(date);

  const openModal = date => {
    setSelectedDate(date);
    const eventsOnDate = events.filter(event => event.date.toDateString() === date.toDateString());
    setSelectedEvents(eventsOnDate);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEventTitle('');
    setEventTime('');
    setSelectedDate(null);
    setSelectedEvents([]);
    setEditingEvent(null);
  };

  const handleAddEvent = () => {
    if (editingEvent) {
      setEvents(events.map(event =>
        event === editingEvent ? { ...event, title: eventTitle, time: eventTime } : event
      ));
    } else {
      setEvents([...events, { date: selectedDate, title: eventTitle, time: eventTime }]);
    }
    closeModal();
  };

  const handleDeleteEvent = event => {
    setEvents(events.filter(e => e !== event));
    const eventsOnDate = events.filter(e => e.date.toDateString() === selectedDate.toDateString());
    setSelectedEvents(eventsOnDate);
  };

  const handleEditEvent = event => {
    setEditingEvent(event);
    setEventTitle(event.title);
    setEventTime(event.time);
    setModalIsOpen(true);
  };

  const renderTileContent = ({ date, view }) => {
    if (view === 'month') {
      const eventsOnDate = events.filter(event => event.date.toDateString() === date.toDateString());
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
      return (
        <div className={`calendar-day ${eventsOnDate.length > 0 ? 'has-event' : ''} ${isSelected ? 'react-calendar__tile--selected' : ''}`}>
          {eventsOnDate.map((event, index) => (
            <div key={index} className="EventItem" onClick={() => handleEditEvent(event)}>
              <span>{event.title} - {event.time}</span>
            </div>
          ))}
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
        onClickDay={openModal}
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
      />
    </div>
  );
};

export default MonthlyCalendar;
