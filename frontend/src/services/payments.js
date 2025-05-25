const MPESA_SANDBOX_URL = 'https://sandbox.safaricom.co.ke'
const API_BASE_URL = 'http://localhost:8000/api'

// Simulated auth token - in production, this would come from your auth system
const getAuthToken = () => localStorage.getItem('auth_token')

export const PaymentService = {
  // Initialize M-PESA STK Push
  initiateMpesaPayment: async (amount, phoneNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/mpesa/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          amount,
          phoneNumber: phoneNumber.replace(/\D/g, ''), // Remove non-digits
          accountReference: 'Kashela Payment',
          transactionDesc: 'Payment for services',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to initiate M-PESA payment')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('M-PESA initiation error:', error)
      throw error
    }
  },

  // Check M-PESA transaction status
  checkMpesaStatus: async (checkoutRequestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/mpesa/status/${checkoutRequestId}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to check payment status')
      }

      return await response.json()
    } catch (error) {
      console.error('M-PESA status check error:', error)
      throw error
    }
  },

  // Simulate bank deposit
  initiateBankDeposit: async (amount, bankDetails) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/bank/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          amount,
          bankName: bankDetails.bankName,
          accountNumber: bankDetails.accountNumber,
          accountName: bankDetails.accountName,
          reference: `KSH-${Date.now()}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to process bank deposit')
      }

      return await response.json()
    } catch (error) {
      console.error('Bank deposit error:', error)
      throw error
    }
  },

  // Mock webhook for payment confirmation
  simulatePaymentConfirmation: async (paymentId, status = 'success') => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          paymentId,
          status,
          timestamp: new Date().toISOString(),
          transactionId: `TRX-${Date.now()}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to confirm payment')
      }

      return await response.json()
    } catch (error) {
      console.error('Payment confirmation error:', error)
      throw error
    }
  },
} 