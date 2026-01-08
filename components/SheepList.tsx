import React, { useState } from 'react';
import { Sheep, Gender, Status } from '../types';
import { Search, Filter, Plus, ChevronRight } from 'lucide-react';

interface SheepListProps {
  sheep: Sheep[];
  onAdd: () => void;
  onSelect: (id: string) => void;
}

export const SheepList: React.FC<SheepListProps> = ({ sheep, onAdd, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');

  const filteredSheep = sheep.filter(s => {
    const matchesSearch = 
      s.tagId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Controls */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Flock Inventory</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Tag ID or Name..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white w-full"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Status | 'All')}
            >
              <option value="All">All Status</option>
              <option value={Status.Active}>Active</option>
              <option value={Status.Sold}>Sold</option>
              <option value={Status.Deceased}>Deceased</option>
            </select>
          </div>

          <button 
            onClick={onAdd}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Add Sheep
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tag ID</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Breed</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSheep.map((s) => {
              const ageYears = new Date().getFullYear() - new Date(s.dob).getFullYear();
              return (
                <tr 
                  key={s.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSelect(s.id)}
                >
                  <td className="p-4 font-medium text-emerald-700">{s.tagId}</td>
                  <td className="p-4 text-gray-800">{s.name || '-'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${s.gender === Gender.Ram ? 'bg-blue-100 text-blue-800' : 
                        s.gender === Gender.Ewe ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'}`}>
                      {s.gender}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{s.breed}</td>
                  <td className="p-4 text-gray-600">{ageYears} yrs</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${s.status === Status.Active ? 'bg-green-100 text-green-800' : 
                        s.status === Status.Sold ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">
                    <ChevronRight size={20} />
                  </td>
                </tr>
              );
            })}
            {filteredSheep.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No sheep found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};