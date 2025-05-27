import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { PaymentService } from '../services/payments'
import { 
  PhoneIcon, 
  BanknotesIcon, 
  ArrowPathIcon, 
  ArrowLeftIcon,
  CurrencyDollarIcon,
  UserIcon,
  BuildingLibraryIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

export default function PaymentForm({ onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    phoneNumber: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleMpesaPayment = async (e) => {
    e.preventDefault()
    if (!formData.amount || !formData.phoneNumber) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsProcessing(true)
    try {
      // Initiate STK Push
      const response = await PaymentService.initiateMpesaPayment(
        parseFloat(formData.amount),
        formData.phoneNumber
      )

      toast.success('Payment request sent to your phone')

      // Start checking payment status
      let attempts = 0
      const maxAttempts = 10
      const checkInterval = setInterval(async () => {
        try {
          setCheckingStatus(true)
          const status = await PaymentService.checkMpesaStatus(response.CheckoutRequestID)
          
          if (status.ResultCode === '0') {
            clearInterval(checkInterval)
            setCheckingStatus(false)
            toast.success('Payment completed successfully')
            
            // Simulate webhook confirmation
            await PaymentService.simulatePaymentConfirmation(response.CheckoutRequestID)
            
            onSuccess({
              type: 'mpesa',
              amount: parseFloat(formData.amount),
              reference: response.CheckoutRequestID,
              status: 'completed',
            })
          }

          attempts++
          if (attempts >= maxAttempts) {
            clearInterval(checkInterval)
            setCheckingStatus(false)
            toast.error('Payment verification timeout. Please check your M-PESA messages')
          }
        } catch (error) {
          console.error('Status check error:', error)
        }
      }, 5000) // Check every 5 seconds

    } catch (error) {
      toast.error(error.message || 'Failed to initiate payment')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBankDeposit = async (e) => {
    e.preventDefault()
    const { amount, bankName, accountNumber, accountName } = formData
    
    if (!amount || !bankName || !accountNumber || !accountName) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsProcessing(true)
    try {
      const response = await PaymentService.initiateBankDeposit(
        parseFloat(amount),
        { bankName, accountNumber, accountName }
      )

      // Simulate successful payment after 2 seconds
      setTimeout(async () => {
        await PaymentService.simulatePaymentConfirmation(response.paymentId)
        
        onSuccess({
          type: 'bank',
          amount: parseFloat(amount),
          reference: response.paymentId,
          status: 'completed',
        })

        toast.success('Bank deposit processed successfully')
      }, 2000)

    } catch (error) {
      toast.error(error.message || 'Failed to process bank deposit')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Payment Method Selection */}
      {!paymentMethod && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <button
            onClick={() => setPaymentMethod('mpesa')}
            className="relative group bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transition-all duration-200 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-burgundy-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="relative flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-burgundy-500 to-teal-500 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                <PhoneIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-display font-semibold text-gray-900">M-PESA</h3>
              <p className="mt-2 text-sm text-center text-gray-500">Fast and secure mobile money payments</p>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('bank')}
            className="relative group bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transition-all duration-200 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-burgundy-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="relative flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-burgundy-500 to-teal-500 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                <BanknotesIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-display font-semibold text-gray-900">Bank Transfer</h3>
              <p className="mt-2 text-sm text-center text-gray-500">Traditional bank transfer payments</p>
            </div>
          </button>
        </div>
      )}

      {/* M-PESA Payment Form */}
      {paymentMethod === 'mpesa' && (
        <form onSubmit={handleMpesaPayment} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-burgundy-500 to-teal-500 text-white shadow-md">
              <PhoneIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-display font-semibold text-gray-900">M-PESA Payment</h3>
          </div>
          
          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-shadow duration-200"
                  placeholder="Enter amount"
                  required
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-shadow duration-200"
                  placeholder="254700000000"
                  required
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
              <button
                type="button"
                onClick={() => setPaymentMethod(null)}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                disabled={isProcessing}
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessing || checkingStatus}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-burgundy-600 to-teal-600 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isProcessing || checkingStatus ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                    {checkingStatus ? 'Checking Status...' : 'Processing...'}
                  </>
                ) : (
                  'Pay Now'
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Bank Transfer Form */}
      {paymentMethod === 'bank' && (
        <form onSubmit={handleBankDeposit} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-burgundy-500 to-teal-500 text-white shadow-md">
              <BanknotesIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-display font-semibold text-gray-900">Bank Transfer</h3>
          </div>
          
          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-shadow duration-200"
                  placeholder="Enter amount"
                  required
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-shadow duration-200"
                  placeholder="Enter bank name"
                  required
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCardIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-shadow duration-200"
                  placeholder="Enter account number"
                  required
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-shadow duration-200"
                  placeholder="Enter account name"
                  required
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
              <button
                type="button"
                onClick={() => setPaymentMethod(null)}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                disabled={isProcessing}
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-burgundy-600 to-teal-600 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isProcessing ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
} 