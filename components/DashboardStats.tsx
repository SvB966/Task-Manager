import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Sparkles, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Task, TaskStatus } from '../types';
import { CATEGORIES, STATUS_LABELS, STATUS_COLORS } from '../constants';
import { Button } from './Button';
import { analyzeSchedule } from '../services/geminiService';

interface DashboardStatsProps {
  tasks: Task[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ tasks }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Data for Status Chart
  const statusData = (Object.keys(STATUS_LABELS) as unknown as TaskStatus[]).map(statusId => ({
    name: STATUS_LABELS[statusId],
    count: tasks.filter(t => t.statusId === Number(statusId)).length,
    color: STATUS_COLORS[Number(statusId) as TaskStatus]
  }));

  // Data for Category Chart
  const categoryData = CATEGORIES.map(cat => ({
    name: cat.name,
    value: tasks.filter(t => t.categoryId === cat.id).length,
    color: cat.color.includes('blue') ? '#3b82f6' : cat.color.includes('purple') ? '#a855f7' : '#ef4444' // Approximating tailwind colors for recharts
  })).filter(d => d.value > 0);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeSchedule(tasks);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity size={20} className="text-indigo-600" />
            Task Status
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Category Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-md p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles size={24} className="text-yellow-300" />
                AI Schedule Assistant
              </h3>
              <p className="text-indigo-100 text-sm mt-1">Get intelligent insights about your productivity and workload.</p>
            </div>
            {!analysis && (
              <Button 
                onClick={handleAnalyze} 
                isLoading={isAnalyzing}
                className="bg-white text-indigo-700 hover:bg-indigo-50 border-none"
              >
                Analyze Workload
              </Button>
            )}
          </div>

          {analysis && (
             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-sm leading-relaxed animate-fade-in border border-white/20">
              <ReactMarkdown 
                components={{
                  ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="text-indigo-50" {...props} />,
                  strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />
                }}
              >
                {analysis}
              </ReactMarkdown>
              <div className="mt-4 flex justify-end">
                <button 
                   onClick={() => setAnalysis(null)}
                   className="text-xs text-indigo-200 hover:text-white underline"
                >
                  Clear Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};