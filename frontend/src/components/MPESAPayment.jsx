import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const MPESAPayment = ({ onSuccess }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const { session } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/pay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    amount: parseFloat(amount),
                    description: 'Payment via MPESA'
                })
            });

            if (!response.ok) {
                throw new Error(`Payment failed: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Show success message
            toast.success('Payment initiated successfully!');
            
            // Clear form
            setPhoneNumber('');
            setAmount('');
            
            // Call success callback
            if (onSuccess) {
                onSuccess(data);
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Failed to process payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">MPESA Payment</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="254700000000"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                        pattern="254[0-9]{9}"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Format: 254XXXXXXXXX
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Amount (KES)
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="1000"
                        min="1"
                        step="1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {loading ? 'Processing...' : 'Pay with MPESA'}
                </button>
            </form>

            <div className="mt-4 text-sm text-gray-500">
                <p>Note: This is a simulated payment for testing purposes.</p>
            </div>
        </div>
    );
};

export default MPESAPayment; 