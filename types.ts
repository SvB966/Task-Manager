export enum TaskStatus {
  NOT_STARTED = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3
}

export enum CategoryId {
  WORK = 1,
  PERSONAL = 2,
  URGENT = 3
}

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
}

export interface Subtask {
  id: number;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  taskDate: Date; // Stored as Date object for easier manipulation
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  duration: number; // minutes
  statusId: TaskStatus;
  categoryId: CategoryId;
  createdAt: Date;
  subtasks: Subtask[];
}

export type ViewMode = 'manage' | 'dashboard';