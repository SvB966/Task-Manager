import React, { useState } from 'react';
import { isSameDay, isSameMonth } from 'date-fns';
import { LayoutDashboard, Calendar as CalendarIcon, CheckSquare } from 'lucide-react';
import { Task, TaskStatus, ViewMode } from './types';
import { INITIAL_TASKS } from './constants';
import { CalendarView } from './components/CalendarView';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { DashboardStats } from './components/DashboardStats';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [viewMode, setViewMode] = useState<ViewMode>('manage');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Math.max(...tasks.map(t => t.id), 0) + 1,
      createdAt: new Date(),
    };
    setTasks([...tasks, task]);
  };

  const updateTaskStatus = (taskId: number, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, statusId: newStatus } : t));
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const toggleSubtask = (taskId: number, subtaskId: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.map(st => 
            st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
          )
        };
      }
      return task;
    }));
  };

  const addSubtask = (taskId: number, title: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: [...task.subtasks, { id: Date.now(), title, isCompleted: false }]
        };
      }
      return task;
    }));
  };

  const filteredTasks = tasks.filter(t => isSameDay(t.taskDate, selectedDate));
  
  // Filter tasks for calendar dots (by month mostly for efficiency, but logic is in CalendarView)
  const monthTasks = tasks.filter(t => isSameMonth(t.taskDate, currentMonth));

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <CheckSquare className="text-indigo-400" />
            Zenith Tasker
          </h1>
        </div>
        
        <nav className="px-3 space-y-2">
          <button
            onClick={() => setViewMode('manage')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
              viewMode === 'manage' 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <CalendarIcon size={20} />
            <span className="font-medium">Manage Tasks</span>
          </button>
          
          <button
            onClick={() => setViewMode('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
              viewMode === 'dashboard' 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
        </nav>
        
        <div className="absolute bottom-0 w-full md:w-64 p-4 bg-slate-950">
          <p className="text-xs text-slate-500 text-center">v1.1.0 • React + Tailwind</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {viewMode === 'manage' ? 'Manage Tasks' : 'Dashboard Overview'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {viewMode === 'manage' 
                ? 'Organize your schedule and track progress.' 
                : 'Analyze your productivity metrics.'}
            </p>
          </div>
        </header>

        {viewMode === 'manage' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Calendar */}
            <div className="lg:col-span-7 xl:col-span-8 h-[600px]">
               <CalendarView 
                  currentDate={currentMonth}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  onMonthChange={setCurrentMonth}
                  tasks={monthTasks}
               />
            </div>

            {/* Right Column: Task Entry & Details */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
              <TaskForm 
                selectedDate={selectedDate}
                onAddTask={addTask}
              />
              <TaskList 
                tasks={filteredTasks}
                selectedDate={selectedDate}
                onStatusChange={updateTaskStatus}
                onDelete={deleteTask}
                onToggleSubtask={toggleSubtask}
                onAddSubtask={addSubtask}
              />
            </div>
          </div>
        ) : (
          <DashboardStats tasks={tasks} />
        )}
      </main>
    </div>
  );
};

export default App;