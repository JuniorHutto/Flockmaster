export const Gender = {
  Ram: 'Ram',
  Ewe: 'Ewe',
  Wether: 'Wether'
} as const;
export type Gender = typeof Gender[keyof typeof Gender];

export const Status = {
  Active: 'Active',
  Sold: 'Sold',
  Deceased: 'Deceased',
  Culled: 'Culled'
} as const;
export type Status = typeof Status[keyof typeof Status];

export interface WeightRecord {
  id: string;
  date: string;
  weight: number;
  note?: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  type: 'Vaccination' | 'Deworming' | 'Injury' | 'Hoof Trim' | 'Lambing' | 'Other';
  description: string;
  cost?: number;
}

export interface Sheep {
  id: string;
  tagId: string; // The visible ear tag
  name?: string;
  breed: string; // Defaults to Katahdin based on context
  gender: Gender;
  dob: string;
  sireId?: string; // ID of father
  damId?: string; // ID of mother
  status: Status;
  color?: string;
  weights: WeightRecord[];
  health: HealthRecord[];
  notes?: string;
}

export type ViewState = 
  | { view: 'DASHBOARD' }
  | { view: 'LIST' }
  | { view: 'ADD' }
  | { view: 'EDIT'; sheepId: string }
  | { view: 'DETAIL'; sheepId: string };
