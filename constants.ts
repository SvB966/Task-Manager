import { Category, CategoryId, Task, TaskStatus } from './types';
import { addDays } from 'date-fns';

export const CATEGORIES: Category[] = [
  { id: CategoryId.WORK, name: 'Work', icon: '💼', color: 'bg-blue-100 text-blue-800' },
  { id: CategoryId.PERSONAL, name: 'Personal', icon: '🏠', color: 'bg-purple-100 text-purple-800' },
  { id: CategoryId.URGENT, name: 'Urgent', icon: '🔥', color: 'bg-red-100 text-red-800' },
];

export const STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.NOT_STARTED]: '#FF4B4B',
  [TaskStatus.IN_PROGRESS]: '#FFA500',
  [TaskStatus.COMPLETED]: '#00CC96',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.NOT_STARTED]: 'Not Started',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.COMPLETED]: 'Completed',
};

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

export const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: 'Q3 Financial Review',
    description: 'Analyze the quarterly reports.',
    taskDate: today,
    startTime: '09:00',
    endTime: '11:00',
    duration: 120,
    statusId: TaskStatus.IN_PROGRESS,
    categoryId: CategoryId.WORK,
    createdAt: new Date(),
    subtasks: [
      { id: 101, title: 'Gather data from Sales', isCompleted: true },
      { id: 102, title: 'Review expense reports', isCompleted: false },
      { id: 103, title: 'Draft executive summary', isCompleted: false },
    ]
  },
  {
    id: 2,
    title: 'Grocery Shopping',
    description: 'Buy milk, eggs, and bread.',
    taskDate: today,
    startTime: '17:30',
    endTime: '18:15',
    duration: 45,
    statusId: TaskStatus.NOT_STARTED,
    categoryId: CategoryId.PERSONAL,
    createdAt: new Date(),
    subtasks: [
      { id: 201, title: 'Check pantry', isCompleted: false },
    ]
  },
  {
    id: 3,
    title: 'Server Migration',
    description: 'Critical security patch deployment.',
    taskDate: addDays(today, 2),
    startTime: '10:00',
    endTime: '12:00',
    duration: 120,
    statusId: TaskStatus.NOT_STARTED,
    categoryId: CategoryId.URGENT,
    createdAt: new Date(),
    subtasks: []
  },
  {
    id: 4,
    title: 'Weekly Standup',
    description: 'Team sync.',
    taskDate: addDays(today, -1),
    startTime: '09:00',
    endTime: '09:30',
    duration: 30,
    statusId: TaskStatus.COMPLETED,
    categoryId: CategoryId.WORK,
    createdAt: new Date(),
    subtasks: []
  },
];