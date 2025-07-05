# Finance Visualizer

A modern, responsive finance tracking application built with Next.js, React, and MongoDB. Track your income, expenses, and visualize your financial data with interactive charts.

## Features

### Stage 1: Basic Transaction Tracking ✅
- **Add/Edit/Delete transactions** with amount, date, and description
- **Transaction list view** with responsive table design
- **Monthly expenses bar chart** using Recharts
- **Client-side form validation** with proper error handling
- **Responsive design** optimized for mobile and desktop
- **Error states** with user-friendly error messages

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Charts**: Recharts for data visualization
- **Database**: MongoDB with MongoDB Driver
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd finance-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/finance-visualizer
   ```
   
   For MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-visualizer
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Adding Transactions
1. Fill out the transaction form with:
   - **Description**: Transaction details
   - **Amount**: Positive number
   - **Type**: Income or Expense
   - **Category**: Predefined categories based on type
   - **Date**: Transaction date

2. Click "Add Transaction" to save

### Managing Transactions
- **View**: All transactions are displayed in a responsive table
- **Edit**: Click the edit icon to modify transaction details
- **Delete**: Click the delete icon to remove transactions

### Dashboard Features
- **Summary Cards**: Total income, expenses, and net income
- **Monthly Chart**: Interactive bar chart showing monthly trends
- **Transaction List**: Complete transaction history with actions

## Project Structure

```
finance-visualizer/
├── app/
│   ├── api/transactions/     # API routes for CRUD operations
│   ├── dashboard/           # Main dashboard page
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── Charts/            # Chart components
│   ├── TransactionForm.tsx # Transaction form
│   └── TransactionList.tsx # Transaction table
├── lib/
│   ├── mongodb.ts         # MongoDB connection
│   └── utils.ts           # Utility functions
└── models/
    └── transaction.ts     # TypeScript interfaces
```

## API Endpoints

- `GET /api/transactions` - Fetch all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions?id=<id>` - Update transaction
- `DELETE /api/transactions?id=<id>` - Delete transaction

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
- `MONGODB_URI`: Your MongoDB connection string

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Future Enhancements (Stage 2 & 3)

- **Categories**: Predefined categories with pie charts
- **Budgeting**: Monthly category budgets and comparisons
- **Insights**: Spending analysis and recommendations
- **Export**: Data export functionality
- **Filters**: Advanced filtering and search
