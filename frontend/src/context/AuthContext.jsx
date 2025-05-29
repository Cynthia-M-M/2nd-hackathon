import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trialInfo, setTrialInfo] = useState(null);

    const supabase = createClient(
        process.env.REACT_APP_SUPABASE_URL,
        process.env.REACT_APP_SUPABASE_ANON_KEY
    );

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                checkTrialStatus(session.user.id);
            }
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                checkTrialStatus(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkTrialStatus = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('user_subscriptions')
                .select('trial_start, trial_end, is_subscribed')
                .eq('user_id', userId)
                .single();

            if (error) throw error;

            if (data) {
                const now = new Date();
                const trialEnd = new Date(data.trial_end);
                const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));

                setTrialInfo({
                    isInTrial: now < trialEnd && !data.is_subscribed,
                    daysLeft: Math.max(0, daysLeft),
                    isSubscribed: data.is_subscribed
                });
            } else {
                // New user - set up trial period
                const trialStart = new Date();
                const trialEnd = new Date();
                trialEnd.setDate(trialEnd.getDate() + 30);

                const { error: insertError } = await supabase
                    .from('user_subscriptions')
                    .insert({
                        user_id: userId,
                        trial_start: trialStart.toISOString(),
                        trial_end: trialEnd.toISOString(),
                        is_subscribed: false
                    });

                if (insertError) throw insertError;

                setTrialInfo({
                    isInTrial: true,
                    daysLeft: 30,
                    isSubscribed: false
                });
            }
        } catch (error) {
            console.error('Error checking trial status:', error);
            toast.error('Failed to check subscription status');
        }
    };

    const mockSubscribe = async () => {
        try {
            const { error } = await supabase
                .from('user_subscriptions')
                .update({ is_subscribed: true })
                .eq('user_id', user.id);

            if (error) throw error;

            setTrialInfo(prev => ({
                ...prev,
                isSubscribed: true
            }));

            toast.success('Subscription activated successfully!');
        } catch (error) {
            console.error('Error updating subscription:', error);
            toast.error('Failed to activate subscription');
        }
    };

    const value = {
        session,
        user,
        trialInfo,
        mockSubscribe,
        signIn: (data) => supabase.auth.signIn(data),
        signUp: (data) => supabase.auth.signUp(data),
        signOut: () => supabase.auth.signOut()
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 