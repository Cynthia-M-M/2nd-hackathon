import React from 'react';
import { useAuth } from '../context/AuthContext';

const TrialBanner = () => {
    const { trialInfo, mockSubscribe } = useAuth();

    if (!trialInfo || trialInfo.isSubscribed) {
        return null;
    }

    if (trialInfo.daysLeft <= 0) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                Your trial has expired. Please subscribe to continue using all features.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={mockSubscribe}
                        className="ml-4 px-3 py-1 text-sm font-medium text-red-700 bg-red-100 border border-red-500 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Subscribe Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            You are in a free trial - {trialInfo.daysLeft} days left
                        </p>
                    </div>
                </div>
                <button
                    onClick={mockSubscribe}
                    className="ml-4 px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-500 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Upgrade Now
                </button>
            </div>
        </div>
    );
};

export default TrialBanner; 