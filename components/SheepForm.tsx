import React, { useState, useEffect } from 'react';
import { Sheep, Gender, Status } from '../types';
import { Save, X } from 'lucide-react';

interface SheepFormProps {
  initialData?: Sheep;
  onSave: (sheep: Sheep) => void;
  onCancel: () => void;
}

export const SheepForm: React.FC<SheepFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Sheep>>({
    tagId: '',
    name: '',
    breed: 'Katahdin',
    gender: Gender.Ewe,
    dob: '',
    status: Status.Active,
    damId: '',
    sireId: '',
    color: '',
    notes: '',
    weights: [],
    health: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tagId || !formData.gender || !formData.status) {
      alert("Please fill in required fields (Tag ID, Gender, Status)");
      return;
    }
    
    const sheep: Sheep = {
      id: initialData?.id || Date.now().toString(),
      tagId: formData.tagId,
      name: formData.name,
      breed: formData.breed || 'Katahdin',
      gender: formData.gender as Gender,
      dob: formData.dob || new Date().toISOString().split('T')[0],
      status: formData.status as Status,
      damId: formData.damId,
      sireId: formData.sireId,
      color: formData.color,
      notes: formData.notes,
      weights: formData.weights || [],
      health: formData.health || []
    };
    
    onSave(sheep);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">{initialData ? 'Edit Sheep' : 'Add New Sheep'}</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tag ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tag ID / Scrapie ID *</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. OH-1234"
              value={formData.tagId}
              onChange={(e) => setFormData({...formData, tagId: e.target.value})}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name (Optional)</label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. Bella"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
            <select 
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value as Gender})}
            >
              <option value={Gender.Ewe}>Ewe</option>
              <option value={Gender.Ram}>Ram</option>
              <option value={Gender.Wether}>Wether</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
            <select 
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as Status})}
            >
              <option value={Status.Active}>Active</option>
              <option value={Status.Sold}>Sold</option>
              <option value={Status.Culled}>Culled</option>
              <option value={Status.Deceased}>Deceased</option>
            </select>
          </div>

          {/* Breed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.breed}
              onChange={(e) => setFormData({...formData, breed: e.target.value})}
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input 
              type="date" 
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.dob}
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
            />
          </div>

          {/* Sire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sire ID (Father)</label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Tag of Sire"
              value={formData.sireId}
              onChange={(e) => setFormData({...formData, sireId: e.target.value})}
            />
          </div>

          {/* Dam */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dam ID (Mother)</label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Tag of Dam"
              value={formData.damId}
              onChange={(e) => setFormData({...formData, damId: e.target.value})}
            />
          </div>
        </div>

        {/* Color */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Color / Markings</label>
           <input 
              type="text" 
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. White with brown spots"
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
            />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea 
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-32"
            placeholder="General observations, distinctive traits..."
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            className="flex-1 bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2"
          >
            <Save size={20} /> Save Sheep
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};