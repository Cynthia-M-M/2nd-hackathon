import { useState } from 'react'
import PaymentForm from '../components/PaymentForm'
import { ArrowUpIcon, CalendarIcon, HashtagIcon } from '@heroicons/react/24/outline'

export default function Payments() {
  const [transactions, setTransactions] = useState([])

  const handlePaymentSuccess = (payment) => {
    const newTransaction = {
      id: Date.now(),
      ...payment,
      date: new Date().toISOString().split('T')[0],
    }

    setTransactions([newTransaction, ...transactions])
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-burgundy-600 to-teal-600 bg-clip-text text-transparent">
          Make a Payment
        </h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Choose your preferred payment method below.
        </p>
      </div>

      {/* Payment Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <PaymentForm onSuccess={handlePaymentSuccess} />
      </div>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-xl font-display font-semibold text-gray-900">
              Recent Payments
            </h3>
            <span className="text-sm text-gray-500">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flow-root">
            <ul role="list" className="-my-5 divide-y divide-gray-100">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="py-5 group transition-colors duration-200 hover:bg-gray-50 rounded-xl">
                  <div className="relative flex items-start space-x-4 px-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-burgundy-500 to-teal-500 text-white shadow-md group-hover:shadow-lg transition-shadow duration-200">
                        <ArrowUpIcon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {transaction.type.toUpperCase()} Payment
                        </p>
                        <div className="ml-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm">
                            KES {transaction.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <HashtagIcon className="h-4 w-4" />
                          <span>{transaction.reference}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{transaction.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
} 