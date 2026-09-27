import React, { useState, useEffect, useRef } from 'react';
import { ViewState, Sheep, HerdExpense, HerdRevenue } from './types';
import { getSheep, saveSheep, deleteSheep, getSheepById } from './services/storageService';
import { Dashboard } from './components/Dashboard';
import { SheepList } from './components/SheepList';
import { SheepForm } from './components/SheepForm';
import { SheepDetail } from './components/SheepDetail';
import { TaskManager } from './components/TaskManager';
import { ProfitabilityView } from './components/ProfitabilityView';
import { exportBackup, importBackup } from './services/backupService';
import { getSyncStatus, subscribeSyncStatus, SyncStatus, persist } from './services/syncService';
import { LayoutGrid, List, Plus, CheckSquare, TrendingUp, Download, Upload, Cloud, CloudOff, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>({ view: 'DASHBOARD' });
  const [data, setData] = useState<Sheep[]>([]);
  const [expenses, setExpenses] = useState<HerdExpense[]>([]);
  const [revenues, setRevenues] = useState<HerdRevenue[]>([]);

  const [backupMessage, setBackupMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pendingRestore, setPendingRestore] = useState<File | null>(null);
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(getSyncStatus());

  useEffect(() => subscribeSyncStatus(setSyncStatus), []);

  const loadData = () => {
    setData(getSheep());
    const savedExpenses = localStorage.getItem('herdExpenses');
    const savedRevenues = localStorage.getItem('herdRevenues');
    setExpenses(savedExpenses ? JSON.parse(savedExpenses) : []);
    setRevenues(savedRevenues ? JSON.parse(savedRevenues) : []);
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const handleRestoreFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) {
      setBackupMessage(null);
      setPendingRestore(file);
    }
  };

  const handleConfirmRestore = async () => {
    if (!pendingRestore) return;
    try {
      await importBackup(pendingRestore);
      loadData();
      setViewState({ view: 'DASHBOARD' });
      setBackupMessage({ type: 'success', text: 'Backup restored.' });
    } catch (err) {
      setBackupMessage({ type: 'error', text: err instanceof Error ? err.message : 'Restore failed.' });
    } finally {
      setPendingRestore(null);
    }
  };

  const handleSaveSheep = (sheep: Sheep) => {
    saveSheep(sheep);
    setData(getSheep());
    setViewState({ view: 'LIST' });
  };

  const handleDeleteSheep = (id: string) => {
    deleteSheep(id);
    setData(getSheep());
    setViewState({ view: 'LIST' });
  };

  const handleAddExpense = (expense: HerdExpense) => {
    const updated = [...expenses, expense];
    setExpenses(updated);
    persist('herdExpenses', updated);
  };

  const handleAddRevenue = (revenue: HerdRevenue) => {
    const updated = [...revenues, revenue];
    setRevenues(updated);
    persist('herdRevenues', updated);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    persist('herdExpenses', updated);
  };

  const handleDeleteRevenue = (id: string) => {
    const updated = revenues.filter(r => r.id !== id);
    setRevenues(updated);
    persist('herdRevenues', updated);
  };

  const renderContent = () => {
    switch (viewState.view) {
      case 'DASHBOARD':
        return <Dashboard sheep={data} />;
      case 'LIST':
        return (
          <SheepList 
            sheep={data} 
            onAdd={() => setViewState({ view: 'ADD' })} 
            onSelect={(id) => setViewState({ view: 'DETAIL', sheepId: id })}
          />
        );
      case 'ADD':
        return (
          <SheepForm 
            onSave={handleSaveSheep} 
            onCancel={() => setViewState({ view: 'LIST' })} 
          />
        );
      case 'EDIT':
        const sheepToEdit = getSheepById(viewState.sheepId);
        if (!sheepToEdit) return <div>Error: Sheep not found</div>;
        return (
          <SheepForm 
            initialData={sheepToEdit} 
            onSave={(updated) => {
              handleSaveSheep(updated);
              setViewState({ view: 'DETAIL', sheepId: updated.id });
            }} 
            onCancel={() => setViewState({ view: 'DETAIL', sheepId: viewState.sheepId })} 
          />
        );
      case 'DETAIL':
        const sheepDetail = getSheepById(viewState.sheepId);
        if (!sheepDetail) return <div>Error: Sheep not found</div>;
        return (
          <SheepDetail 
            sheep={sheepDetail} 
            onBack={() => setViewState({ view: 'LIST' })}
            onEdit={() => setViewState({ view: 'EDIT', sheepId: sheepDetail.id })}
            onUpdate={(updated) => {
               saveSheep(updated);
               setData(getSheep()); // Refresh global data
            }}
            onDelete={() => handleDeleteSheep(sheepDetail.id)}
          />
        );
      case 'TASKS':
        return <TaskManager />;
      case 'PROFITABILITY':
        return (
          <ProfitabilityView 
            expenses={expenses}
            revenues={revenues}
            onAddExpense={handleAddExpense}
            onAddRevenue={handleAddRevenue}
            onDeleteExpense={handleDeleteExpense}
            onDeleteRevenue={handleDeleteRevenue}
          />
        );
      default:
        return <div>Not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-green-50/50 flex flex-col md:flex-row font-sans text-gray-900">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex-shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <img 
            src="/sheep.jpg" 
            alt="FlockMaster Logo" 
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">FlockMaster</h1>
        </div>
        
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setViewState({ view: 'DASHBOARD' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${viewState.view === 'DASHBOARD' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutGrid size={20} />
            Dashboard
          </button>
          
          <button 
            onClick={() => setViewState({ view: 'LIST' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${viewState.view === 'LIST' || viewState.view === 'DETAIL' || viewState.view === 'EDIT' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <List size={20} />
            Inventory
          </button>

          <button 
            onClick={() => setViewState({ view: 'ADD' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${viewState.view === 'ADD' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Plus size={20} />
            Add Sheep
          </button>

          <button 
            onClick={() => setViewState({ view: 'TASKS' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${viewState.view === 'TASKS' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <CheckSquare size={20} />
            Tasks
          </button>

          <button 
            onClick={() => setViewState({ view: 'PROFITABILITY' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${viewState.view === 'PROFITABILITY' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <TrendingUp size={20} />
            Profitability
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Data</p>
          <div
            className={`mx-2 px-2 flex items-center gap-2 text-sm
              ${syncStatus === 'synced' ? 'text-emerald-700' : syncStatus === 'offline' ? 'text-amber-700' : 'text-gray-500'}`}
            title={syncStatus === 'offline' ? 'Changes are saved in this browser and will upload when the server is reachable.' : undefined}
          >
            {syncStatus === 'synced' && <><Cloud size={16} /> Saved to database</>}
            {syncStatus === 'syncing' && <><RefreshCw size={16} className="animate-spin" /> Saving...</>}
            {syncStatus === 'offline' && <><CloudOff size={16} /> Server offline, saved locally</>}
          </div>
          <button
            onClick={() => { setBackupMessage(null); exportBackup(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
          >
            <Download size={20} />
            Backup Data
          </button>
          <button
            onClick={() => restoreInputRef.current?.click()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
          >
            <Upload size={20} />
            Restore Data
          </button>
          <input
            ref={restoreInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleRestoreFileChosen}
          />

          {pendingRestore && (
            <div className="mx-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm">
              <p className="text-amber-800 mb-2">
                Replace all current data with <span className="font-medium break-all">{pendingRestore.name}</span>?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmRestore}
                  className="flex-1 bg-amber-600 text-white px-3 py-1.5 rounded hover:bg-amber-700"
                >
                  Restore
                </button>
                <button
                  onClick={() => setPendingRestore(null)}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {backupMessage && (
            <p className={`mx-2 text-sm ${backupMessage.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
              {backupMessage.text}
            </p>
          )}
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;