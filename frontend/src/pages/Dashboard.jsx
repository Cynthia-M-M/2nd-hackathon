import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { 
  PlusIcon, 
  ArrowUpIcon, 
  CreditCardIcon, 
  BanknotesIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline'
import TransactionInput from '../components/TransactionInput'
import FinancialAnalytics from '../components/FinancialAnalytics'

export default function Dashboard() {
  const [showTransactionInput, setShowTransactionInput] = useState(false)
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', amount: 2500, category: 'Food', description: 'Grocery shopping', date: '2024-01-15' },
    { id: 2, type: 'income', amount: 50000, category: 'Salary', description: 'Monthly salary', date: '2024-01-01' },
    { id: 3, type: 'expense', amount: 1200, category: 'Transport', description: 'Uber ride', date: '2024-01-14' },
    { id: 4, type: 'expense', amount: 3500, category: 'Entertainment', description: 'Movie night', date: '2024-01-10' },
    { id: 5, type: 'income', amount: 15000, category: 'Freelance', description: 'Web design project', date: '2024-01-08' },
    { id: 6, type: 'expense', amount: 4500, category: 'Shopping', description: 'New clothes', date: '2024-01-05' },
    { id: 7, type: 'expense', amount: 2000, category: 'Utilities', description: 'Electricity bill', date: '2024-01-03' },
  ])

  const handleSaveTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      date: new Date().toISOString().split('T')[0],
    }

    setTransactions([newTransaction, ...transactions])
    setShowTransactionInput(false)
    toast.success('Transaction saved successfully')
  }

  const transactionMethods = [
    {
      name: 'Manual Entry',
      icon: PlusIcon,
      description: 'Add transaction details manually',
      action: () => setShowTransactionInput(true),
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50'
    },
    {
      name: 'Scan Receipt',
      icon: DocumentTextIcon,
      description: 'Upload receipt image for OCR',
      action: () => setShowTransactionInput(true),
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-50 to-purple-50'
    },
    {
      name: 'Bank Transfer',
      icon: BanknotesIcon,
      description: 'Direct bank transfer',
      action: () => setShowTransactionInput(true),
      gradient: 'from-burgundy-500 to-rose-500',
      bgGradient: 'from-burgundy-50 to-rose-50'
    },
    {
      name: 'M-PESA',
      icon: CreditCardIcon,
      description: 'Mobile money transfer',
      action: () => setShowTransactionInput(true),
      gradient: 'from-cyan-500 to-blue-500',
      bgGradient: 'from-cyan-50 to-blue-50'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-burgundy-600 to-teal-600 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Track your finances and manage your transactions
        </p>
      </div>

      {/* Transaction Input */}
      {showTransactionInput ? (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-300 ease-in-out">
          <TransactionInput
            onSave={handleSaveTransaction}
            onCancel={() => setShowTransactionInput(false)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {transactionMethods.map((method) => (
            <button
              key={method.name}
              onClick={method.action}
              className="relative group bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-burgundy-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="relative flex flex-col items-center text-center space-y-4">
                <div className={`flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br ${method.gradient} text-white shadow-lg group-hover:shadow-xl transition-shadow duration-200`}>
                  <method.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-gray-900">{method.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{method.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Financial Analytics */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-burgundy-500 to-teal-500 text-white shadow-md">
            <ArrowTrendingUpIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-display font-semibold text-gray-900">Financial Analytics</h2>
            <p className="mt-1 text-sm text-gray-500">Track your financial performance</p>
          </div>
        </div>
        <FinancialAnalytics transactions={transactions} />
      </div>
    </div>
  )
} 