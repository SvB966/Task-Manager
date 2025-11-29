import React, { useState, useEffect } from 'react';
import { format, addMinutes, differenceInMinutes, parse } from 'date-fns';
import { Plus, X, ListTodo } from 'lucide-react';
import { CategoryId, Task, TaskStatus } from '../types';
import { CATEGORIES, STATUS_LABELS } from '../constants';
import { Button } from './Button';

interface TaskFormProps {
  selectedDate: Date;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ selectedDate, onAddTask }) => {
  const [title, setTitle] = useState('');
  
  // Time & Duration State
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [duration, setDuration] = useState(60); // minutes

  const [categoryId, setCategoryId] = useState<CategoryId>(CategoryId.WORK);
  const [statusId, setStatusId] = useState<TaskStatus>(TaskStatus.NOT_STARTED);
  
  // Subtasks State
  const [tempSubtask, setTempSubtask] = useState('');
  const [subtasks, setSubtasks] = useState<{title: string, isCompleted: boolean}[]>([]);

  // Reset form when selected date changes
  useEffect(() => {
    // Optional: Reset fields or focus when date changes
  }, [selectedDate]);

  // Handle Time Calculations
  const handleStartTimeChange = (val: string) => {
    setStartTime(val);
    if (!val) return;
    
    try {
      const start = parse(val, 'HH:mm', new Date());
      const end = addMinutes(start, duration);
      setEndTime(format(end, 'HH:mm'));
    } catch (e) {
      console.error("Invalid time format");
    }
  };

  const handleEndTimeChange = (val: string) => {
    setEndTime(val);
    if (!val) return;

    try {
      const start = parse(startTime, 'HH:mm', new Date());
      const end = parse(val, 'HH:mm', new Date());
      let diff = differenceInMinutes(end, start);
      if (diff < 0) diff = 0; // Prevent negative duration
      setDuration(diff);
    } catch (e) {
      console.error("Invalid time format");
    }
  };

  const handleDurationChange = (val: number) => {
    setDuration(val);
    try {
      const start = parse(startTime, 'HH:mm', new Date());
      const end = addMinutes(start, val);
      setEndTime(format(end, 'HH:mm'));
    } catch (e) {
      console.error("Invalid time format");
    }
  };

  const addSubtask = () => {
    if (!tempSubtask.trim()) return;
    setSubtasks([...subtasks, { title: tempSubtask, isCompleted: false }]);
    setTempSubtask('');
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      description: '', 
      taskDate: selectedDate,
      startTime,
      endTime,
      duration,
      categoryId,
      statusId,
      subtasks: subtasks.map((st, i) => ({ ...st, id: Date.now() + i })) // Generate IDs
    });

    // Reset Form
    setTitle('');
    setStartTime('09:00');
    setEndTime('10:00');
    setDuration(60);
    setSubtasks([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Plus size={20} className="text-indigo-600" />
        Add New Task
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="e.g., Team Meeting"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm">
              {format(selectedDate, 'MMM d, yyyy')}
            </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
             <input
              type="number"
              min="0"
              step="5"
              value={duration}
              onChange={(e) => handleDurationChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
             />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusId}
              onChange={(e) => setStatusId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              {(Object.keys(STATUS_LABELS) as unknown as TaskStatus[]).map(status => (
                <option key={status} value={status}>{STATUS_LABELS[status]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Subtasks Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <ListTodo size={16} /> Subtasks
          </label>
          
          <div className="flex gap-2 mb-3">
            <input 
              type="text" 
              value={tempSubtask}
              onChange={(e) => setTempSubtask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
              placeholder="Add a step..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button 
              type="button" 
              onClick={addSubtask}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          {subtasks.length > 0 && (
            <ul className="space-y-2 mb-2">
              {subtasks.map((st, idx) => (
                <li key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded border border-gray-100">
                  <span className="text-gray-700">{st.title}</span>
                  <button type="button" onClick={() => removeSubtask(idx)} className="text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button type="submit" className="w-full mt-2">
          Save Task
        </Button>
      </form>
    </div>
  );
};