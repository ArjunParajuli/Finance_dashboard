'use client';

import { useState } from 'react';
import { Transaction } from '../models/transaction';
import { formatCurrency, formatDate } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Edit, Trash2, Plus, Receipt } from 'lucide-react';
import TransactionForm from './TransactionForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, transaction: any) => void;
  isLoading?: boolean;
}

export default function TransactionList({ 
  transactions, 
  onDelete, 
  onUpdate,
  isLoading = false 
}: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (transactionData: any) => {
    if (editingTransaction && onUpdate) {
      await onUpdate(editingTransaction._id?.toString() || '', transactionData);
      setIsEditDialogOpen(false);
      setEditingTransaction(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="pb-8 px-8 pt-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Receipt className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">Transactions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="pb-8 px-8 pt-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Receipt className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">Transactions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">No transactions yet</h3>
            <p className="text-gray-500 text-base">Add your first transaction to start tracking your finances</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="pb-8 px-8 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Transactions</CardTitle>
                <p className="text-sm text-gray-500 mt-2">
                  {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} total
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-700 py-4">Date</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">Description</TableHead>
                  <TableHead className="font-semibold text-gray-700 hidden md:table-cell py-4">Category</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right py-4">Amount</TableHead>
                  {(onDelete || onUpdate) && (
                    <TableHead className="font-semibold text-gray-700 text-center py-4">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction._id?.toString()} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-900 py-4">
                      {formatDate(new Date(transaction.date))}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate font-medium text-gray-900 py-4">
                      {transaction.description}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-600 py-4">
                      {transaction.category}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        variant={transaction.type === 'income' ? 'default' : 'destructive'}
                        className="font-medium"
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-bold text-lg py-4 ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </TableCell>
                    {(onDelete || onUpdate) && (
                      <TableCell className="text-center py-4">
                        <div className="flex justify-center gap-3">
                          {onUpdate && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(transaction)}
                              className="h-10 w-10 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDelete(transaction._id?.toString() || '')}
                              className="h-10 w-10 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {onUpdate && editingTransaction && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Edit Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm
              onSubmit={handleUpdate}
              isEditing={true}
              initialData={{
                description: editingTransaction.description,
                amount: editingTransaction.amount,
                type: editingTransaction.type,
                category: editingTransaction.category,
                date: new Date(editingTransaction.date).toISOString().split('T')[0]
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
} 