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

export interface BreedingRecord {
  id: string;
  date: string;
  sireId: string;
  sireName?: string;
  pregnancyCheckDate?: string;
  isPregnant?: boolean;
  lambBornDate?: string;
  notes?: string;
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
  breedingRecords: BreedingRecord[];
  notes?: string;
  breedingDate?: string;
  isPregnant?: boolean;
  dueDate?: string;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type ReminderType = 'None' | 'Same Day' | '1 Day Before' | '2 Days Before' | '1 Week Before';

export type ExpenseCategory = 'Feed' | 'Bedding' | 'Mineral' | 'Veterinary' | 'Other';
export type RevenueCategory = 'Meat' | 'Breeding Stock' | 'Wool' | 'Other';

export interface HerdExpense {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
}

export interface HerdRevenue {
  id: string;
  date: string;
  category: RevenueCategory;
  sheepId?: string;
  amount: number;
  description?: string;
}

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
  | { view: 'TASKS' }
  | { view: 'PROFITABILITY' };