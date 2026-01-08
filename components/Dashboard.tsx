import React, { useMemo } from 'react';
import { Sheep, Gender, Status } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, Scale, Activity, TrendingUp } from 'lucide-react';

interface DashboardProps {
  sheep: Sheep[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export const Dashboard: React.FC<DashboardProps> = ({ sheep }) => {
  
  const activeSheep = useMemo(() => sheep.filter(s => s.status === Status.Active), [sheep]);
  
  const stats = useMemo(() => {
    const ewes = activeSheep.filter(s => s.gender === Gender.Ewe).length;
    const rams = activeSheep.filter(s => s.gender === Gender.Ram).length;
    const wethers = activeSheep.filter(s => s.gender === Gender.Wether).length;
    const lambs = activeSheep.filter(s => {
      const dob = new Date(s.dob);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return dob > oneYearAgo;
    }).length;

    return { ewes, rams, wethers, lambs, total: activeSheep.length };
  }, [activeSheep]);

  const compositionData = [
    { name: 'Ewes', value: stats.ewes },
    { name: 'Rams', value: stats.rams },
    { name: 'Wethers', value: stats.wethers },
  ].filter(d => d.value > 0);

  // Calculate average weight by gender (simple logic taking most recent weight)
  const weightData = useMemo(() => {
    const getAvg = (gender: Gender) => {
      const filtered = activeSheep.filter(s => s.gender === gender && s.weights.length > 0);
      if (filtered.length === 0) return 0;
      const sum = filtered.reduce((acc, curr) => {
        // Get most recent weight
        const recent = [...curr.weights].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        return acc + recent.weight;
      }, 0);
      return Math.round(sum / filtered.length);
    };

    return [
      { name: 'Ewes', weight: getAvg(Gender.Ewe) },
      { name: 'Rams', weight: getAvg(Gender.Ram) },
      { name: 'Lambs', weight: 45 }, // Placeholder or calculate specifically for < 1yr
    ];
  }, [activeSheep]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Flock Overview</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Flock</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Lambs (&lt;1yr)</p>
            <p className="text-2xl font-bold text-gray-800">{stats.lambs}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Ewes</p>
            <p className="text-2xl font-bold text-gray-800">{stats.ewes}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
            <Scale size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg Ram Wt</p>
            <p className="text-2xl font-bold text-gray-800">
               {weightData.find(d => d.name === 'Rams')?.weight || 0} lbs
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Flock Composition</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {compositionData.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-sm text-gray-600">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Weights (lbs)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="weight" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};