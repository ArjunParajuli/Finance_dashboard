'use client';

import { MonthlyStats } from '../../models/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../lib/utils';
import { BarChart3 } from 'lucide-react';

interface MonthlyBarChartProps {
  data: MonthlyStats[];
  isLoading?: boolean;
}

export default function MonthlyBarChart({ data, isLoading = false }: MonthlyBarChartProps) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="pb-8 px-8 pt-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">Monthly Overview</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="pb-8 px-8 pt-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">Monthly Overview</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <BarChart3 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">No data available</h3>
            <p className="text-gray-500 text-base">Add transactions to see monthly trends</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for Recharts
  const chartData = data.map(item => ({
    month: `${item.year}-${item.month.toString().padStart(2, '0')}`,
    income: item.income,
    expenses: item.expenses,
    net: item.net
  }));

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const formatXAxis = (tickItem: string) => {
    const [year, month] = tickItem.split('-');
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{formatXAxis(label)}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-medium">Income:</span>
              <span className="font-bold text-green-600">{formatCurrency(payload[0]?.value || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-red-600 font-medium">Expenses:</span>
              <span className="font-bold text-red-600">{formatCurrency(payload[1]?.value || 0)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${payload[2]?.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Net:
                </span>
                <span className={`font-bold ${payload[2]?.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(payload[2]?.value || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader className="pb-8 px-8 pt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">Monthly Overview</CardTitle>
            <p className="text-sm text-gray-500 mt-2">
              Track your income vs expenses over time
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="month" 
                tickFormatter={formatXAxis}
                fontSize={12}
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                fontSize={12}
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ paddingBottom: '10px' }}
              />
              <Bar 
                dataKey="income" 
                fill="#10b981" 
                name="Income"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="expenses" 
                fill="#ef4444" 
                name="Expenses"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 