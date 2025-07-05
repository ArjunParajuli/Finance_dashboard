'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import TransactionForm from '../../components/TransactionForm';
import TransactionList from '../../components/TransactionList';
import MonthlyBarChart from '../../components/Charts/MonthlyBarChart';
import { Transaction, TransactionInput, MonthlyStats } from '../../models/transaction';
import { formatCurrency, calculateTotalIncome, calculateTotalExpenses, calculateNetIncome } from '../../lib/utils';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    calculateMonthlyStats();
  }, [transactions]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else {
        throw new Error('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMonthlyStats = () => {
    const stats: { [key: string]: MonthlyStats } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const key = `${year}-${month}`;
      
      if (!stats[key]) {
        stats[key] = {
          month,
          year,
          income: 0,
          expenses: 0,
          net: 0
        };
      }
      
      if (transaction.type === 'income') {
        stats[key].income += transaction.amount;
      } else {
        stats[key].expenses += transaction.amount;
      }
      
      stats[key].net = stats[key].income - stats[key].expenses;
    });
    
    setMonthlyStats(Object.values(stats).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    }));
  };

  const handleAddTransaction = async (transactionData: TransactionInput) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        await fetchTransactions();
      } else {
        throw new Error('Failed to add transaction');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Failed to add transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTransaction = async (id: string, transactionData: TransactionInput) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        await fetchTransactions();
      } else {
        throw new Error('Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      setError('Failed to update transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTransactions();
      } else {
        throw new Error('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError('Failed to delete transaction. Please try again.');
    }
  };

  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const netIncome = calculateNetIncome(transactions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="container mx-auto max-w-none">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Finance Dashboard</h1>
          <p className="text-lg text-gray-600">Track your income, expenses, and financial goals</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-12 max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Total Income</CardTitle>
              <div className="p-2 bg-green-200 rounded-full">
                <TrendingUp className="h-4 w-4 text-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{formatCurrency(totalIncome)}</div>
              <p className="text-sm text-green-600 mt-1">
                {transactions.filter(t => t.type === 'income').length} income transactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-red-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Total Expenses</CardTitle>
              <div className="p-2 bg-red-200 rounded-full">
                <TrendingDown className="h-4 w-4 text-red-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700">{formatCurrency(totalExpenses)}</div>
              <p className="text-sm text-red-600 mt-1">
                {transactions.filter(t => t.type === 'expense').length} expense transactions
              </p>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-lg ${
            netIncome >= 0 
              ? 'bg-gradient-to-r from-blue-50 to-blue-100' 
              : 'bg-gradient-to-r from-orange-50 to-orange-100'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${
                netIncome >= 0 ? 'text-blue-800' : 'text-orange-800'
              }`}>
                Net Income
              </CardTitle>
              <div className={`p-2 rounded-full ${
                netIncome >= 0 ? 'bg-blue-200' : 'bg-orange-200'
              }`}>
                <DollarSign className={`h-4 w-4 ${
                  netIncome >= 0 ? 'text-blue-700' : 'text-orange-700'
                }`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${
                netIncome >= 0 ? 'text-blue-700' : 'text-orange-700'
              }`}>
                {formatCurrency(netIncome)}
              </div>
              <p className={`text-sm mt-1 ${
                netIncome >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {netIncome >= 0 ? 'Positive balance' : 'Negative balance'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Transaction Form */}
          <div className="order-2 lg:order-1">
            <TransactionForm onSubmit={handleAddTransaction} isLoading={isSubmitting} />
          </div>

          {/* Monthly Chart */}
          <div className="order-1 lg:order-2">
            <MonthlyBarChart data={monthlyStats} isLoading={isLoading} />
          </div>
        </div>

        {/* Transaction List */}
        <div className="mb-8">
          <TransactionList 
            transactions={transactions} 
            onDelete={handleDeleteTransaction}
            onUpdate={handleUpdateTransaction}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
} 