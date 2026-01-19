import React, { useState } from 'react';
import { Sheep, Gender, Status } from '../types';
import { Search, Filter, Plus, ChevronRight, Download, Calendar } from 'lucide-react';
import { exportFlockData } from '../services/exportService';

interface SheepListProps {
  sheep: Sheep[];
  onAdd: () => void;
  onSelect: (id: string) => void;
}

export const SheepList: React.FC<SheepListProps> = ({ sheep, onAdd, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');
  const [dobStart, setDobStart] = useState('');
  const [dobEnd, setDobEnd] = useState('');

  const filteredSheep = sheep.filter(s => {
    const matchesSearch = 
      s.tagId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;

    const matchesDob = (!dobStart || s.dob >= dobStart) && 
                       (!dobEnd || s.dob <= dobEnd);

    return matchesSearch && matchesStatus && matchesDob;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Controls */}
      <div className="p-6 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap">Flock Inventory</h2>
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full xl:w-auto items-center">
          
          {/* Search */}
          <div className="relative w-full sm:w-auto sm:flex-1 xl:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Tag ID or Name..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative w-full sm:w-auto">
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

          {/* DOB Range Filter */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white w-full sm:w-auto">
            <Calendar size={18} className="text-gray-400 flex-shrink-0" />
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                className="text-sm outline-none text-gray-600 bg-transparent w-full sm:w-32"
                value={dobStart}
                onChange={(e) => setDobStart(e.target.value)}
                title="Born After"
              />
              <span className="text-gray-400">-</span>
              <input 
                type="date" 
                className="text-sm outline-none text-gray-600 bg-transparent w-full sm:w-32"
                value={dobEnd}
                onChange={(e) => setDobEnd(e.target.value)}
                title="Born Before"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full sm:w-auto ml-auto sm:ml-0">
            <button 
              onClick={() => exportFlockData(filteredSheep)}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors flex-1 sm:flex-none"
              title="Export filtered list to CSV"
            >
              <Download size={18} />
              <span className="sm:hidden xl:inline">Export</span>
            </button>

            <button 
              onClick={onAdd}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex-1 sm:flex-none"
            >
              <Plus size={18} />
              <span className="whitespace-nowrap">Add Sheep</span>
            </button>
          </div>
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