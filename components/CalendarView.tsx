import React from 'react';
import { 
  format, 
  endOfMonth, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface CalendarViewProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  tasks: Task[];
}

// Local helpers to replace missing date-fns imports
const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const startOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Adjust to Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  tasks
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => {
    onMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    onMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getTaskStatusDots = (day: Date) => {
    const dayTasks = tasks.filter(t => isSameDay(t.taskDate, day));
    if (dayTasks.length === 0) return null;

    // Show up to 3 dots indicating status of tasks on that day
    return (
      <div className="flex gap-1 mt-1 justify-center">
        {dayTasks.slice(0, 3).map((task) => (
          <div 
            key={task.id} 
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: STATUS_COLORS[task.statusId] }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full">
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-grow auto-rows-fr">
        {calendarDays.map((day, dayIdx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div
              key={day.toString()}
              onClick={() => onDateSelect(day)}
              className={`
                min-h-[80px] border-b border-r border-gray-100 p-2 cursor-pointer transition-colors
                ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-900'}
                ${isSelected ? 'ring-2 ring-inset ring-indigo-600 z-10' : 'hover:bg-gray-50'}
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`
                  text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                  ${isToday(day) ? 'bg-indigo-600 text-white shadow-md' : ''}
                `}>
                  {format(day, 'd')}
                </span>
              </div>
              {getTaskStatusDots(day)}
            </div>
          );
        })}
      </div>
    </div>
  );
};