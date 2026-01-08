import React, { useState } from 'react';
import { Sheep, WeightRecord, HealthRecord, Gender } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowLeft, Edit2, Scale, Syringe, Save, Trash2, Calendar, Droplet, Activity } from 'lucide-react';

interface SheepDetailProps {
  sheep: Sheep;
  onBack: () => void;
  onEdit: () => void;
  onUpdate: (updatedSheep: Sheep) => void;
  onDelete: () => void;
}

export const SheepDetail: React.FC<SheepDetailProps> = ({ sheep, onBack, onEdit, onUpdate, onDelete }) => {
  const [newWeight, setNewWeight] = useState('');
  const [newWeightDate, setNewWeightDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [newHealthType, setNewHealthType] = useState<HealthRecord['type']>('Vaccination');
  const [newHealthDesc, setNewHealthDesc] = useState('');
  const [newHealthDate, setNewHealthDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddWeight = () => {
    if (!newWeight) return;
    const weightRec: WeightRecord = {
      id: Date.now().toString(),
      date: newWeightDate,
      weight: parseFloat(newWeight)
    };
    const updated = { ...sheep, weights: [...sheep.weights, weightRec] };
    onUpdate(updated);
    setNewWeight('');
  };

  const handleAddHealth = () => {
    if (!newHealthDesc) return;
    const healthRec: HealthRecord = {
      id: Date.now().toString(),
      date: newHealthDate,
      type: newHealthType,
      description: newHealthDesc
    };
    const updated = { ...sheep, health: [...sheep.health, healthRec] };
    onUpdate(updated);
    setNewHealthDesc('');
  };

  const sortedWeights = [...sheep.weights].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const sortedHealth = [...sheep.health].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-emerald-700 font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Flock
        </button>
        <div className="flex gap-2">
          <button onClick={onEdit} className="flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200">
            <Edit2 size={16} className="mr-2" /> Edit Profile
          </button>
          <button onClick={() => { if(confirm('Are you sure you want to delete this sheep?')) onDelete() }} className="flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200">
            <Trash2 size={16} className="mr-2" /> Delete
          </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
               <h1 className="text-4xl font-bold text-gray-900">{sheep.tagId}</h1>
               {sheep.name && <span className="text-2xl text-gray-500">"{sheep.name}"</span>}
               <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${sheep.gender === Gender.Ram ? 'bg-blue-100 text-blue-800' : 
                    sheep.gender === Gender.Ewe ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'}`}>
                  {sheep.gender}
               </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Breed</p>
                <p className="font-semibold text-gray-800">{sheep.breed}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Date of Birth</p>
                <p className="font-semibold text-gray-800">{sheep.dob}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Dam ID</p>
                <p className="font-semibold text-emerald-700">{sheep.damId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Sire ID</p>
                <p className="font-semibold text-emerald-700">{sheep.sireId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Status</p>
                <p className="font-semibold text-gray-800">{sheep.status}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Color/Markings</p>
                <p className="font-semibold text-gray-800">{sheep.color || 'N/A'}</p>
              </div>
            </div>

            {sheep.notes && (
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <p className="text-sm text-yellow-800 font-medium mb-1">Notes</p>
                <p className="text-gray-700 italic">{sheep.notes}</p>
              </div>
            )}
          </div>
          
          {/* Recent Stats Summary */}
          <div className="md:w-64 bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col justify-center">
             <div className="mb-4">
               <p className="text-gray-500 text-sm">Last Weight</p>
               <p className="text-3xl font-bold text-gray-800">
                 {sortedWeights.length > 0 ? `${sortedWeights[sortedWeights.length - 1].weight} lbs` : 'N/A'}
               </p>
               <p className="text-xs text-gray-400">
                 {sortedWeights.length > 0 ? sortedWeights[sortedWeights.length - 1].date : ''}
               </p>
             </div>
             <div>
               <p className="text-gray-500 text-sm">Total Health Events</p>
               <p className="text-3xl font-bold text-gray-800">{sheep.health.length}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weight Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Scale className="mr-2 text-emerald-600" size={20}/> Weight History
            </h3>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Add Weight Record</h4>
            <div className="flex gap-3">
              <input 
                type="date" 
                value={newWeightDate}
                onChange={(e) => setNewWeightDate(e.target.value)}
                className="p-2 border border-gray-200 rounded text-sm w-36"
              />
              <input 
                type="number" 
                placeholder="Lbs" 
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="p-2 border border-gray-200 rounded text-sm w-24"
              />
              <button 
                onClick={handleAddWeight}
                className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700"
              >
                <Save size={18} />
              </button>
            </div>
          </div>

          <div className="h-64 mb-4">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={sortedWeights}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="date" />
                 <YAxis domain={['auto', 'auto']} />
                 <Tooltip />
                 <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
               </LineChart>
             </ResponsiveContainer>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-right py-2">Weight</th>
                </tr>
              </thead>
              <tbody>
                {sortedWeights.map(w => (
                  <tr key={w.id} className="border-b border-gray-50">
                    <td className="py-2 text-gray-600">{w.date}</td>
                    <td className="py-2 text-right font-medium text-gray-800">{w.weight} lbs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Health Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Syringe className="mr-2 text-blue-600" size={20}/> Health Records
            </h3>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Add Health Record</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input 
                type="date" 
                value={newHealthDate}
                onChange={(e) => setNewHealthDate(e.target.value)}
                className="p-2 border border-gray-200 rounded text-sm"
              />
              <select 
                value={newHealthType}
                onChange={(e) => setNewHealthType(e.target.value as any)}
                className="p-2 border border-gray-200 rounded text-sm bg-white"
              >
                <option value="Vaccination">Vaccination</option>
                <option value="Deworming">Deworming</option>
                <option value="Injury">Injury</option>
                <option value="Hoof Trim">Hoof Trim</option>
                <option value="Lambing">Lambing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Description / Notes (e.g. CD&T, FAMACHA score)" 
                value={newHealthDesc}
                onChange={(e) => setNewHealthDesc(e.target.value)}
                className="p-2 border border-gray-200 rounded text-sm flex-1"
              />
              <button 
                onClick={handleAddHealth}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                <Save size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {sortedHealth.map(h => (
              <div key={h.id} className="flex gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                   ${h.type === 'Vaccination' ? 'bg-blue-100 text-blue-600' :
                     h.type === 'Deworming' ? 'bg-purple-100 text-purple-600' :
                     h.type === 'Injury' ? 'bg-red-100 text-red-600' :
                     'bg-gray-100 text-gray-600'}`}>
                   {h.type === 'Vaccination' ? <Syringe size={18} /> : 
                    h.type === 'Deworming' ? <Droplet size={18} /> : 
                    <Activity size={18} />}
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-start">
                     <p className="font-semibold text-gray-800">{h.type}</p>
                     <span className="text-xs text-gray-500 flex items-center"><Calendar size={12} className="mr-1"/>{h.date}</span>
                   </div>
                   <p className="text-sm text-gray-600 mt-1">{h.description}</p>
                 </div>
              </div>
            ))}
            {sortedHealth.length === 0 && (
              <p className="text-center text-gray-400 py-8">No health records found.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};