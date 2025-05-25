import { useState } from 'react'
import PaymentForm from '../components/PaymentForm'
import { ArrowUpIcon } from '@heroicons/react/24/outline'

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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold text-gray-900">Make a Payment</h2>
        <p className="mt-2 text-gray-600">Choose your preferred payment method below.</p>
      </div>

      {/* Payment Form */}
      <PaymentForm onSuccess={handlePaymentSuccess} />

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Payments</h3>
          <div className="flow-root">
            <ul role="list" className="-my-5 divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <ArrowUpIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {transaction.type.toUpperCase()} Payment
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Ref: {transaction.reference}
                      </p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        KES {transaction.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">{transaction.date}</div>
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