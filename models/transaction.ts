import { ObjectId } from 'mongodb';

export interface Transaction {
  _id?: ObjectId;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TransactionInput {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
}

export interface MonthlyStats {
  month: number;
  year: number;
  income: number;
  expenses: number;
  net: number;
}

export const TRANSACTION_CATEGORIES = {
  income: [
    'Salary',
    'Freelance',
    'Investment',
    'Business',
    'Other Income'
  ],
  expense: [
    'Food & Dining',
    'Transportation',
    'Housing',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Education',
    'Travel',
    'Other Expenses'
  ]
} as const; 