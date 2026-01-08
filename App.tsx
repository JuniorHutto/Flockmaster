import React, { useState, useEffect } from 'react';
import { ViewState, Sheep } from './types';
import { getSheep, saveSheep, deleteSheep, getSheepById } from './services/storageService';
import { Dashboard } from './components/Dashboard';
import { SheepList } from './components/SheepList';
import { SheepForm } from './components/SheepForm';
import { SheepDetail } from './components/SheepDetail';
import { LayoutGrid, List, Plus, Settings, Sprout } from 'lucide-react';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>({ view: 'DASHBOARD' });
  const [data, setData] = useState<Sheep[]>([]);

  // Load data on mount
  useEffect(() => {
    setData(getSheep());
  }, []);

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
      default:
        return <div>Not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-green-50/50 flex flex-col md:flex-row font-sans text-gray-900">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex-shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Sprout className="text-white" size={24} />
          </div>
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
        </nav>

        <div className="absolute bottom-0 w-full md:w-64 p-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings size={20} />
            Settings
          </button>
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