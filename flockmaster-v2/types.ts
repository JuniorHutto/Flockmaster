export const Gender = {
  Ram: 'Ram',
  Ewe: 'Ewe',
  Wether: 'Wether'
} as const;
export type Gender = 'Ram' | 'Ewe' | 'Wether';

export const Status = {
  Active: 'Active',
  Sold: 'Sold',
  Deceased: 'Deceased',
  Culled: 'Culled'
} as const;
export type Status = 'Active' | 'Sold' | 'Deceased' | 'Culled';

export type HealthEventType = 'Vaccination' | 'Deworming' | 'Injury' | 'Hoof Trim' | 'Lambing' | 'Other';

export interface WeightRecord {
  id: string;
  date: string;
  weight: number;
  note?: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  type: HealthEventType;
  description: string;
  cost?: number;
}

export interface Sheep {
  id: string;
  tagId: string;
  name?: string;
  breed: string;
  gender: Gender;
  dob: string;
  sireId?: string;
  damId?: string;
  status: Status;
  color?: string;
  saleDate?: string;
  salePrice?: number;
  weights: WeightRecord[];
  health: HealthRecord[];
  notes?: string;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type ReminderType = 'None' | 'Same Day' | '1 Day Before' | '2 Days Before' | '1 Week Before';

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  assignedTo?: string;
  description?: string;
  reminderType?: ReminderType;
  reminderSent?: boolean;
}

export type ViewState = 
  | { view: 'DASHBOARD' }
  | { view: 'LIST' }
  | { view: 'ADD' }
  | { view: 'EDIT'; sheepId: string; }
  | { view: 'DETAIL'; sheepId: string; }
  | { view: 'TASKS' };