import { Sheep, Gender, Status, Task } from '../types';

const STORAGE_KEY = 'flockmaster_data_v1';
const TASKS_STORAGE_KEY = 'flockmaster_tasks_v1';

// Seed data based on the PDF context (Freckles, Friendly, etc.)
const SEED_DATA: Sheep[] = [
  {
    id: '1',
    tagId: 'OH-001',
    name: 'Freckles',
    breed: 'Katahdin',
    gender: Gender.Ewe,
    dob: '2020-03-15',
    status: Status.Active,
    color: 'White/Brown Spots',
    notes: 'Exceptional mothering ability. Raised triplets successfully on pasture.',
    weights: [
      { id: 'w1', date: '2020-03-15', weight: 8 },
      { id: 'w2', date: '2020-05-15', weight: 45 },
      { id: 'w3', date: '2021-03-01', weight: 140 }
    ],
    health: [
      { id: 'h1', date: '2020-04-01', type: 'Vaccination', description: 'CD&T Booster' },
      { id: 'h2', date: '2020-06-01', type: 'Deworming', description: 'Clean, no treatment needed (FAMACHA 1)' }
    ]
  },
  {
    id: '2',
    tagId: 'OH-002',
    name: 'Friendly',
    breed: 'Katahdin',
    gender: Gender.Ewe,
    dob: '2020-03-10',
    status: Status.Active,
    color: 'White',
    notes: 'Produces heavy twins, but average mothering instinct.',
    weights: [
      { id: 'w1', date: '2020-03-10', weight: 9 },
      { id: 'w2', date: '2020-05-10', weight: 52 },
      { id: 'w3', date: '2021-03-01', weight: 165 }
    ],
    health: []
  },
  {
    id: '3',
    tagId: 'OH-003',
    name: 'Tank',
    breed: 'Katahdin',
    gender: Gender.Ram,
    dob: '2021-02-20',
    status: Status.Active,
    color: 'Red',
    damId: '2',
    notes: 'Primary sire. Good parasite resistance.',
    weights: [
      { id: 'w1', date: '2021-02-20', weight: 11 },
      { id: 'w2', date: '2021-04-20', weight: 65 },
      { id: 'w3', date: '2022-01-15', weight: 210 }
    ],
    health: []
  }
];

const SEED_TASKS: Task[] = [
  {
    id: '1',
    title: 'Order Hay',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
    status: 'Pending',
    assignedTo: 'John',
    description: 'Order 50 bales of orchard grass for winter.',
    reminderType: '1 Week Before',
    reminderSent: false
  },
  {
    id: '2',
    title: 'Vaccinate Lambs',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'In Progress',
    assignedTo: 'Vet',
    reminderType: 'Same Day',
    reminderSent: false
  }
];

export const getSheep = (): Sheep[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    // Initialize with seed data if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  return JSON.parse(data);
};

export const saveSheep = (sheep: Sheep): void => {
  const allSheep = getSheep();
  const existingIndex = allSheep.findIndex(s => s.id === sheep.id);
  
  if (existingIndex >= 0) {
    allSheep[existingIndex] = sheep;
  } else {
    allSheep.push(sheep);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allSheep));
};

export const deleteSheep = (id: string): void => {
  const allSheep = getSheep();
  const filtered = allSheep.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getSheepById = (id: string): Sheep | undefined => {
  const allSheep = getSheep();
  return allSheep.find(s => s.id === id);
};

// --- Task Functions ---

export const getTasks = (): Task[] => {
  const data = localStorage.getItem(TASKS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(SEED_TASKS));
    return SEED_TASKS;
  }
  return JSON.parse(data);
};

export const saveTask = (task: Task): void => {
  const allTasks = getTasks();
  const existingIndex = allTasks.findIndex(t => t.id === task.id);
  
  if (existingIndex >= 0) {
    allTasks[existingIndex] = task;
  } else {
    allTasks.push(task);
  }
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(allTasks));
};

export const deleteTask = (id: string): void => {
  const allTasks = getTasks();
  const filtered = allTasks.filter(t => t.id !== id);
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(filtered));
};

export const deleteCompletedTasks = (): void => {
  const allTasks = getTasks();
  const activeTasks = allTasks.filter(t => t.status !== 'Completed');
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(activeTasks));
};