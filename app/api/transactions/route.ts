import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { Transaction, TransactionInput } from '../../../models/transaction';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('finance-visualizer');
    const collection = db.collection('transactions');

    const transactions = await collection
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TransactionInput = await request.json();
    
    // Validate required fields
    if (!body.description || !body.amount || !body.type || !body.category || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('finance-visualizer');
    const collection = db.collection('transactions');

    const transaction: Omit<Transaction, '_id'> = {
      description: body.description,
      amount: body.amount,
      type: body.type,
      category: body.category,
      date: new Date(body.date),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(transaction);
    
    return NextResponse.json(
      { 
        message: 'Transaction created successfully',
        id: result.insertedId 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body: TransactionInput = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.description || !body.amount || !body.type || !body.category || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('finance-visualizer');
    const collection = db.collection('transactions');

    const { ObjectId } = await import('mongodb');
    
    const updatedTransaction = {
      description: body.description,
      amount: body.amount,
      type: body.type,
      category: body.category,
      date: new Date(body.date),
      updatedAt: new Date()
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedTransaction }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Transaction updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('finance-visualizer');
    const collection = db.collection('transactions');

    const { ObjectId } = await import('mongodb');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Transaction deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
} 