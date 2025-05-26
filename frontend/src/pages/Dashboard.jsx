import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { 
  PlusIcon, 
  ArrowUpIcon, 
  CreditCardIcon, 
  BanknotesIcon,
  DocumentTextIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline'
import TransactionInput from '../components/TransactionInput'
import FinancialAnalytics from '../components/FinancialAnalytics'
import { fetchTransactions, addTransaction } from '../api'

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
      action: () => setShowTransactionInput(true)
    },
    {
      name: 'Scan Receipt',
      icon: DocumentTextIcon,
      description: 'Upload receipt image for OCR',
      action: () => setShowTransactionInput(true)
    },
    {
      name: 'Bank Transfer',
      icon: BanknotesIcon,
      description: 'Direct bank transfer',
      action: () => setShowTransactionInput(true)
    },
    {
      name: 'M-PESA',
      icon: CreditCardIcon,
      description: 'Mobile money transfer',
      action: () => setShowTransactionInput(true)
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Transaction Input */}
      {showTransactionInput ? (
        <div className="bg-white rounded-2xl shadow-card p-6 transition-all duration-300 ease-in-out">
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
              className="group relative bg-white rounded-2xl shadow-card p-6 hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-teal-50 rounded-xl group-hover:bg-teal-100 transition-colors duration-300">
                  <method.icon className="h-8 w-8 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-medium text-gray-900">{method.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{method.description}</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-burgundy-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>
      )}

      {/* Financial Analytics */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <ChartBarIcon className="h-6 w-6 text-teal-600" />
          <h2 className="text-2xl font-display font-semibold text-gray-900">Financial Analytics</h2>
        </div>
        <FinancialAnalytics transactions={transactions} />
      </div>
    </div>
  )
} 