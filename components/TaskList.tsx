import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Clock, CheckCircle2, Circle, Plus, ListTodo } from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { CATEGORIES, STATUS_COLORS, STATUS_LABELS } from '../constants';

interface TaskListProps {
  tasks: Task[];
  selectedDate: Date;
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void;
  onDelete: (taskId: number) => void;
  onToggleSubtask: (taskId: number, subtaskId: number) => void;
  onAddSubtask: (taskId: number, title: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  selectedDate, 
  onStatusChange, 
  onDelete,
  onToggleSubtask,
  onAddSubtask
}) => {
  const [newSubtaskInputs, setNewSubtaskInputs] = useState<Record<number, string>>({});

  // Sort tasks by time
  const sortedTasks = [...tasks].sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleAddSubtaskChange = (taskId: number, val: string) => {
    setNewSubtaskInputs(prev => ({ ...prev, [taskId]: val }));
  };

  const submitSubtask = (taskId: number) => {
    const val = newSubtaskInputs[taskId];
    if (val && val.trim()) {
      onAddSubtask(taskId, val.trim());
      setNewSubtaskInputs(prev => ({ ...prev, [taskId]: '' }));
    }
  };

  if (sortedTasks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-2 text-4xl">☕</div>
        <p className="text-gray-500 font-medium">No tasks for {format(selectedDate, 'MMM d')}.</p>
        <p className="text-sm text-gray-400 mt-1">Enjoy your free time!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h3 className="font-bold text-gray-800">Tasks for {format(selectedDate, 'MMMM d')}</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {sortedTasks.map((task) => {
          const category = CATEGORIES.find(c => c.id === task.categoryId);
          const completedSubtasks = task.subtasks.filter(st => st.isCompleted).length;
          const totalSubtasks = task.subtasks.length;
          
          return (
            <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors group">
              <div className="flex items-start gap-3">
                {/* Status Color Bar */}
                <div 
                  className="w-1.5 self-stretch rounded-full flex-shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[task.statusId] }}
                />
                
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-800 truncate">{task.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${category?.color || 'bg-gray-100'}`}>
                      {category?.icon} {category?.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {task.startTime} - {task.endTime} 
                      <span className="ml-1 opacity-70">({task.duration}m)</span>
                    </div>
                  </div>

                  {/* Subtasks Display */}
                  <div className="mt-3">
                    {totalSubtasks > 0 && (
                      <div className="mb-2 text-xs text-gray-500 font-medium">
                        Progress: {completedSubtasks}/{totalSubtasks}
                      </div>
                    )}
                    
                    <ul className="space-y-1.5 mb-2">
                      {task.subtasks.map(st => (
                        <li key={st.id} className="flex items-center gap-2 text-sm group/subtask">
                          <button 
                            onClick={() => onToggleSubtask(task.id, st.id)}
                            className={`flex-shrink-0 transition-colors ${st.isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
                          >
                            {st.isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                          </button>
                          <span className={`${st.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                            {st.title}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Quick Add Subtask */}
                    <div className="flex items-center gap-2 mt-2">
                       <div className="relative flex-grow max-w-[200px]">
                         <input 
                           type="text"
                           value={newSubtaskInputs[task.id] || ''}
                           onChange={(e) => handleAddSubtaskChange(task.id, e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && submitSubtask(task.id)}
                           placeholder="Add subtask..."
                           className="w-full text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                         />
                         <button 
                          onClick={() => submitSubtask(task.id)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                          disabled={!newSubtaskInputs[task.id]}
                         >
                           <Plus size={14} />
                         </button>
                       </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-2">
                    <select
                      value={task.statusId}
                      onChange={(e) => onStatusChange(task.id, Number(e.target.value))}
                      className="text-xs border border-gray-200 rounded-md py-1 px-2 bg-white focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                      {(Object.keys(STATUS_LABELS) as unknown as TaskStatus[]).map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>

                    <button 
                      onClick={() => onDelete(task.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1 flex items-center gap-1 text-xs"
                      title="Delete task"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};