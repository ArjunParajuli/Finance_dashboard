'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { TransactionInput, TRANSACTION_CATEGORIES } from '../models/transaction';
import { cn } from '../lib/utils';
import { Plus, Edit } from 'lucide-react';

const transactionSchema = z.object({
  description: z.string().min(1, 'Description is required').max(100, 'Description must be less than 100 characters'),
  amount: z.number().positive('Amount must be positive').min(0.01, 'Amount must be at least $0.01'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required')
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSubmit: (transaction: TransactionInput) => void;
  isLoading?: boolean;
  initialData?: TransactionInput;
  isEditing?: boolean;
}

export default function TransactionForm({ 
  onSubmit, 
  isLoading = false, 
  initialData,
  isEditing = false 
}: TransactionFormProps) {
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>(initialData?.type || 'expense');

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData || {
      description: '',
      amount: 0,
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0]
    }
  });

  const handleSubmit = (data: TransactionFormData) => {
    onSubmit(data);
    if (!isEditing) {
      form.reset();
      setSelectedType('expense');
    }
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value as 'income' | 'expense');
    form.setValue('type', value as 'income' | 'expense');
    form.setValue('category', ''); // Reset category when type changes
  };

  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader className="pb-8 px-8 pt-8">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${
            isEditing ? 'bg-blue-100' : 'bg-green-100'
          }`}>
            {isEditing ? (
              <Edit className={`h-6 w-6 ${
                isEditing ? 'text-blue-600' : 'text-green-600'
              }`} />
            ) : (
              <Plus className="h-6 w-6 text-green-600" />
            )}
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-8">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description *
              </Label>
              <Input
                id="description"
                {...form.register('description')}
                placeholder="Enter transaction description"
                className={cn(
                  "h-12",
                  form.formState.errors.description && "border-red-500 focus:border-red-500"
                )}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Amount *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                {...form.register('amount', { valueAsNumber: true })}
                placeholder="0.00"
                className={cn(
                  "h-12",
                  form.formState.errors.amount && "border-red-500 focus:border-red-500"
                )}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                Type *
              </Label>
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger className={cn(
                  "h-12",
                  form.formState.errors.type && "border-red-500 focus:border-red-500"
                )}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                Category *
              </Label>
              <Select 
                value={form.watch('category')} 
                onValueChange={(value) => form.setValue('category', value)}
              >
                <SelectTrigger className={cn(
                  "h-12",
                  form.formState.errors.category && "border-red-500 focus:border-red-500"
                )}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSACTION_CATEGORIES[selectedType].map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="date" className="text-sm font-medium text-gray-700">
              Date *
            </Label>
            <Input
              id="date"
              type="date"
              {...form.register('date')}
              className={cn(
                "h-12",
                form.formState.errors.date && "border-red-500 focus:border-red-500"
              )}
            />
            {form.formState.errors.date && (
              <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Update Transaction' : 'Add Transaction')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
