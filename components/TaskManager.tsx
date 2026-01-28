import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, ReminderType } from '../types';
import { getTasks, saveTask, deleteTask, deleteCompletedTasks } from '../services/storageService';
import { Plus, CheckCircle2, Circle, Clock, Trash2, User, Calendar, X, ArrowUpNarrowWide, ArrowDownWideNarrow, AlertCircle, PlayCircle, Bell } from 'lucide-react';

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);
  
  // Initialize new task
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    assignedTo: '',
    description: '',
    reminderType: 'None'
  });

  useEffect(() => {
    setTasks(getTasks());
    
    // Request notification permission on load
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // Check for reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      if (Notification.permission !== 'granted') return;

      const currentTasks = getTasks();
      let updated = false;

      const now = new Date();
      
      const newTasks = currentTasks.map(task => {
        if (task.status === 'Completed' || task.reminderSent || !task.reminderType || task.reminderType === 'None') {
          return task;
        }

        const dueDate = new Date(task.dueDate);
        // Set due date to 8:00 AM local time for calculation
        dueDate.setHours(8, 0, 0, 0);

        let triggerDate = new Date(dueDate);

        // Calculate trigger time based on type
        switch (task.reminderType) {
          case 'Same Day':
            // Trigger date is same as due date (8am)
            break;
          case '1 Day Before':
            triggerDate.setDate(dueDate.getDate() - 1);
            break;
          case '2 Days Before':
            triggerDate.setDate(dueDate.getDate() - 2);
            break;
          case '1 Week Before':
            triggerDate.setDate(dueDate.getDate() - 7);
            break;
        }

        // If current time is past the trigger time, send notification
        if (now >= triggerDate) {
          new Notification(`Farm Task Reminder: ${task.title}`, {
            body: `Due: ${task.dueDate}. ${task.description || ''}`,
            icon: '/sheep.jpg'
          });
          updated = true;
          return { ...task, reminderSent: true };
        }
        return task;
      });

      if (updated) {
        // Save batch updates
        newTasks.forEach(t => saveTask(t));
        setTasks(newTasks);
      }
    };

    const intervalId = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Also check immediately on mount/update

    return () => clearInterval(intervalId);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      status: (newTask.status as TaskStatus) || 'Pending',
      assignedTo: newTask.assignedTo,
      description: newTask.description,
      reminderType: newTask.reminderType || 'None',
      reminderSent: false
    };

    saveTask(task);
    setTasks(getTasks());
    setIsAdding(false);
    
    // Reset form
    setNewTask({
      title: '',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      assignedTo: '',
      description: '',
      reminderType: 'None'
    });
  };

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    const updated = { ...task, status: newStatus };
    saveTask(updated);
    setTasks(getTasks());
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this task?')) {
      deleteTask(id);
      setTasks(getTasks());
    }
  };

  const handleClearCompleted = () => {
    if (confirm('Are you sure you want to remove all completed tasks?')) {
      deleteCompletedTasks();
      setTasks(getTasks());
    }
  };

  const sortTasks = (a: Task, b: Task) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return sortAscending ? dateA - dateB : dateB - dateA;
  };

  const pendingTasks = tasks.filter(t => t.status !== 'Completed').sort(sortTasks);
  const completedTasks = tasks.filter(t => t.status === 'Completed').sort(sortTasks);

  const getStatusBorder = (status: TaskStatus) => {
    switch(status) {
      case 'In Progress': return 'border-blue-500';
      case 'Pending': return 'border-amber-400';
      case 'Completed': return 'border-emerald-500';
      default: return 'border-gray-200';
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch(status) {
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Farm Tasks</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setSortAscending(!sortAscending)}
            className="bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
            title={sortAscending ? "Sort by Earliest Due Date" : "Sort by Latest Due Date"}
          >
            {sortAscending ? <ArrowUpNarrowWide size={20} /> : <ArrowDownWideNarrow size={20} />}
            <span className="hidden sm:inline">Sort Date</span>
          </button>
          
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2 transition-colors"
          >
            {isAdding ? <X size={20} /> : <Plus size={20} />}
            {isAdding ? 'Cancel' : 'New Task'}
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
              <input 
                required
                type="text" 
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. Order Feed"
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
              <input 
                required
                type="date" 
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newTask.dueDate || ''}
                onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Optional"
                value={newTask.assignedTo}
                onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
               <select 
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                value={newTask.status}
                onChange={e => setNewTask({...newTask, status: e.target.value as TaskStatus})}
               >
                 <option value="Pending">Pending</option>
                 <option value="In Progress">In Progress</option>
                 <option value="Completed">Completed</option>
               </select>
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                 <Bell size={14} /> Reminder
               </label>
               <select 
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                value={newTask.reminderType}
                onChange={e => setNewTask({...newTask, reminderType: e.target.value as ReminderType})}
               >
                 <option value="None">No Reminder</option>
                 <option value="Same Day">Same Day (8:00 AM)</option>
                 <option value="1 Day Before">1 Day Before (8:00 AM)</option>
                 <option value="2 Days Before">2 Days Before (8:00 AM)</option>
                 <option value="1 Week Before">1 Week Before (8:00 AM)</option>
               </select>
               <p className="text-xs text-gray-400 mt-1">Browser notifications must be enabled.</p>
            </div>
          </div>
          <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
             <textarea 
               className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-20"
               placeholder="Additional details..."
               value={newTask.description}
               onChange={e => setNewTask({...newTask, description: e.target.value})}
             />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 font-medium">Save Task</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending & In Progress */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <Clock size={20} className="text-orange-500" />
            To Do & In Progress
          </h3>
          {pendingTasks.length === 0 && <p className="text-gray-400 italic">No pending tasks.</p>}
          {pendingTasks.map(task => (
            <div key={task.id} className={`bg-white p-4 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-shadow ${getStatusBorder(task.status)}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <button 
                      onClick={() => handleStatusChange(task, 'Completed')}
                      className="text-gray-400 hover:text-emerald-600 transition-colors"
                      title="Mark as Completed"
                    >
                      <Circle size={22} />
                    </button>
                    <h4 className="font-bold text-gray-800 text-lg">{task.title}</h4>
                  </div>
                  {task.description && <p className="text-gray-600 text-sm ml-8 mb-2">{task.description}</p>}
                  
                  <div className="flex flex-wrap gap-2 ml-8 text-sm text-gray-500 items-center">
                    <span className="flex items-center gap-1 min-w-[100px]">
                      <Calendar size={14} />
                      {task.dueDate}
                    </span>
                    
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadge(task.status)}`}>
                      {task.status === 'In Progress' ? <PlayCircle size={12} /> : <AlertCircle size={12} />}
                      {task.status}
                    </span>

                    {task.assignedTo && (
                      <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                        <User size={12} />
                        {task.assignedTo}
                      </span>
                    )}

                    {task.reminderType && task.reminderType !== 'None' && (
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${task.reminderSent ? 'bg-gray-100 text-gray-400' : 'bg-yellow-100 text-yellow-700'}`} title={`Reminder: ${task.reminderType}`}>
                        <Bell size={12} className={task.reminderSent ? "" : "fill-current"} />
                        {task.reminderSent ? 'Sent' : 'Set'}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => handleDelete(task.id)} className="text-gray-300 hover:text-red-500 ml-2">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Completed */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-600" />
              Completed
            </h3>
            {completedTasks.length > 0 && (
              <button 
                onClick={handleClearCompleted}
                className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded transition-colors"
                title="Clear all completed tasks"
              >
                <Trash2 size={14} /> Clear All
              </button>
            )}
          </div>
          {completedTasks.length === 0 && <p className="text-gray-400 italic">No completed tasks yet.</p>}
          {completedTasks.map(task => (
            <div key={task.id} className="bg-gray-50 p-4 rounded-xl border-l-4 border-emerald-500 opacity-75">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <button 
                      onClick={() => handleStatusChange(task, 'Pending')}
                      className="text-emerald-600 hover:text-orange-500 transition-colors"
                      title="Mark as Pending"
                    >
                      <CheckCircle2 size={22} />
                    </button>
                    <h4 className="font-semibold text-gray-500 line-through decoration-gray-400">{task.title}</h4>
                  </div>
                  <div className="flex flex-wrap gap-4 ml-8 text-sm text-gray-400">
                     <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {task.dueDate}
                     </span>
                     <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                        {task.status}
                     </span>
                     {task.assignedTo && <span>Assigned: {task.assignedTo}</span>}
                  </div>
                </div>
                <button onClick={() => handleDelete(task.id)} className="text-gray-300 hover:text-red-500 ml-2">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};