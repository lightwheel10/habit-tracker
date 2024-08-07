import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({ selectedDate, setSelectedDate, setShowCalendar }) => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="text-gray-600 p-2"></div>);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
    days.push(
      <div 
        key={i} 
        className={`p-2 text-center cursor-pointer hover:bg-gray-700 rounded ${isToday ? 'bg-blue-600' : ''}`}
        onClick={() => {
          setSelectedDate(new Date(year, month, i));
          setShowCalendar(false);
        }}
      >
        {i}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded shadow-lg w-64">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setSelectedDate(new Date(year, month - 1, 1))}>
          <ChevronLeft size={20} />
        </button>
        <span>{months[month]} {year}</span>
        <button onClick={() => setSelectedDate(new Date(year, month + 1, 1))}>
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map(day => (
          <div key={day} className="text-center font-bold">{day}</div>
        ))}
        {days}
      </div>
    </div>
  );
};

export default Calendar;