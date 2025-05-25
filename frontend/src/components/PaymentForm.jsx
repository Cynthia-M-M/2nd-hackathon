import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { PaymentService } from '../services/payments'
import { PhoneIcon, BanknotesIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

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
    <div className="space-y-6">
      {/* Payment Method Selection */}
      {!paymentMethod && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => setPaymentMethod('mpesa')}
            className="card flex flex-col items-center p-6 hover:border-primary-500 hover:ring-1 hover:ring-primary-500"
          >
            <PhoneIcon className="h-8 w-8 text-primary-600" />
            <h3 className="mt-3 font-medium">M-PESA</h3>
            <p className="mt-1 text-sm text-gray-500">Pay via M-PESA</p>
          </button>

          <button
            onClick={() => setPaymentMethod('bank')}
            className="card flex flex-col items-center p-6 hover:border-primary-500 hover:ring-1 hover:ring-primary-500"
          >
            <BanknotesIcon className="h-8 w-8 text-primary-600" />
            <h3 className="mt-3 font-medium">Bank Transfer</h3>
            <p className="mt-1 text-sm text-gray-500">Pay via bank transfer</p>
          </button>
        </div>
      )}

      {/* M-PESA Payment Form */}
      {paymentMethod === 'mpesa' && (
        <form onSubmit={handleMpesaPayment} className="card border border-primary-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">M-PESA Payment</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (KES)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="input-field mt-1"
                placeholder="Enter amount"
                required
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="input-field mt-1"
                placeholder="254700000000"
                required
                disabled={isProcessing}
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setPaymentMethod(null)}
                className="btn-secondary"
                disabled={isProcessing}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessing || checkingStatus}
                className="btn-primary flex items-center"
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
        <form onSubmit={handleBankDeposit} className="card border border-primary-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Transfer</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (KES)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="input-field mt-1"
                placeholder="Enter amount"
                required
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                className="input-field mt-1"
                placeholder="Enter bank name"
                required
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className="input-field mt-1"
                placeholder="Enter account number"
                required
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Account Name</label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleInputChange}
                className="input-field mt-1"
                placeholder="Enter account name"
                required
                disabled={isProcessing}
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setPaymentMethod(null)}
                className="btn-secondary"
                disabled={isProcessing}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="btn-primary flex items-center"
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