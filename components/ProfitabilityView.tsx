import React, { useState, useMemo } from 'react';
import { HerdExpense, HerdRevenue, ExpenseCategory, RevenueCategory } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

/* Lightweight local icon components to avoid external dependency on 'lucide-react' */
type IconProps = { size?: number; className?: string };

const Plus: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
  </svg>
);

const Trash2: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <polyline strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="3 6 5 6 21 6" />
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const DollarSign: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 1v2M12 21v2M17 5.5A3.5 3.5 0 0 0 7 8.5c0 2 3 2.5 4 3 1 0.5 1 1.5 1 2.5 0 2-3 2.5-4 3" />
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6.5c4 0 6 1 6 4.5s-2 4.5-6 4.5" />
  </svg>
);

const TrendingUp: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
    <polyline strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="14 7 21 7 21 14" />
  </svg>
);

const TrendingDown: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 7l-6 6-4-4-8 8" />
    <polyline strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="10 17 3 17 3 10" />
  </svg>
);

interface ProfitabilityViewProps {
  expenses: HerdExpense[];
  revenues: HerdRevenue[];
  onAddExpense: (expense: HerdExpense) => void;
  onAddRevenue: (revenue: HerdRevenue) => void;
  onDeleteExpense: (id: string) => void;
  onDeleteRevenue: (id: string) => void;
}

const EXPENSE_COLORS: { [key in ExpenseCategory]: string } = {
  'Feed': '#10b981',
  'Bedding': '#8b5cf6',
  'Mineral': '#f59e0b',
  'Veterinary': '#ef4444',
  'Other': '#6b7280'
};

const REVENUE_COLORS: { [key in RevenueCategory]: string } = {
  'Meat': '#d97706',
  'Breeding Stock': '#06b6d4',
  'Wool': '#eab308',
  'Other': '#6b7280'
};

export const ProfitabilityView: React.FC<ProfitabilityViewProps> = ({
  expenses,
  revenues,
  onAddExpense,
  onAddRevenue,
  onDeleteExpense,
  onDeleteRevenue
}) => {
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState<ExpenseCategory>('Feed');
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseDate, setNewExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  const [newRevenueAmount, setNewRevenueAmount] = useState('');
  const [newRevenueCategory, setNewRevenueCategory] = useState<RevenueCategory>('Meat');
  const [newRevenueDesc, setNewRevenueDesc] = useState('');
  const [newRevenueDate, setNewRevenueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddExpense = () => {
    if (!newExpenseAmount) return;
    const expense: HerdExpense = {
      id: Date.now().toString(),
      date: newExpenseDate,
      category: newExpenseCategory,
      amount: parseFloat(newExpenseAmount),
      description: newExpenseDesc || undefined
    };
    onAddExpense(expense);
    setNewExpenseAmount('');
    setNewExpenseDesc('');
  };

  const handleAddRevenue = () => {
    if (!newRevenueAmount) return;
    const revenue: HerdRevenue = {
      id: Date.now().toString(),
      date: newRevenueDate,
      category: newRevenueCategory,
      amount: parseFloat(newRevenueAmount),
      description: newRevenueDesc || undefined
    };
    onAddRevenue(revenue);
    setNewRevenueAmount('');
    setNewRevenueDesc('');
  };

  const stats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
    const profit = totalRevenue - totalExpenses;
    return { totalExpenses, totalRevenue, profit };
  }, [expenses, revenues]);

  const expenseByCategory = useMemo(() => {
    const categories: { [key in ExpenseCategory]?: number } = {};
    expenses.forEach(e => {
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  }, [expenses]);

  const revenueByCategory = useMemo(() => {
    const categories: { [key in RevenueCategory]?: number } = {};
    revenues.forEach(r => {
      categories[r.category] = (categories[r.category] || 0) + r.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  }, [revenues]);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg border shadow-sm ${stats.profit >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stats.profit >= 0 ? 'bg-emerald-200' : 'bg-red-200'}`}>
              <DollarSign size={24} className={stats.profit >= 0 ? 'text-emerald-600' : 'text-red-600'} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Net Profit/Loss</p>
              <p className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                ${stats.profit.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Expenses by Category</h3>
          {expenseByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={expenseByCategory} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: $${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[entry.name as ExpenseCategory]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">No expense data</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Revenue by Category</h3>
          {revenueByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={revenueByCategory} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: $${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {revenueByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={REVENUE_COLORS[entry.name as RevenueCategory]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">No revenue data</div>
          )}
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Add Expense</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
          <input
            type="date"
            value={newExpenseDate}
            onChange={(e) => setNewExpenseDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={newExpenseCategory}
            onChange={(e) => setNewExpenseCategory(e.target.value as ExpenseCategory)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Feed">Feed</option>
            <option value="Bedding">Bedding</option>
            <option value="Mineral">Mineral</option>
            <option value="Veterinary">Veterinary</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="number"
            placeholder="Amount ($)"
            value={newExpenseAmount}
            onChange={(e) => setNewExpenseAmount(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={newExpenseDesc}
            onChange={(e) => setNewExpenseDesc(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleAddExpense}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>

      {/* Add Revenue Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Add Revenue</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
          <input
            type="date"
            value={newRevenueDate}
            onChange={(e) => setNewRevenueDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={newRevenueCategory}
            onChange={(e) => setNewRevenueCategory(e.target.value as RevenueCategory)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Meat">Meat</option>
            <option value="Breeding Stock">Breeding Stock</option>
            <option value="Wool">Wool</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="number"
            placeholder="Amount ($)"
            value={newRevenueAmount}
            onChange={(e) => setNewRevenueAmount(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={newRevenueDesc}
            onChange={(e) => setNewRevenueDesc(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleAddRevenue}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Expenses</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {expenses.length === 0 ? (
              <p className="text-gray-400 text-sm">No expenses recorded</p>
            ) : (
              expenses.map((exp) => (
                <div key={exp.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{exp.category}</p>
                    <p className="text-sm text-gray-500">{exp.date}</p>
                    {exp.description && <p className="text-sm text-gray-600">{exp.description}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-red-600">${exp.amount.toFixed(2)}</p>
                    <button
                      onClick={() => onDeleteExpense(exp.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Revenue</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {revenues.length === 0 ? (
              <p className="text-gray-400 text-sm">No revenue recorded</p>
            ) : (
              revenues.map((rev) => (
                <div key={rev.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{rev.category}</p>
                    <p className="text-sm text-gray-500">{rev.date}</p>
                    {rev.description && <p className="text-sm text-gray-600">{rev.description}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-green-600">${rev.amount.toFixed(2)}</p>
                    <button
                      onClick={() => onDeleteRevenue(rev.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
