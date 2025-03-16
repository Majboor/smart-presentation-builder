
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type SubscriptionStatus = 'free' | 'paid';

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  free_trial_used: boolean;
  presentations_generated: number;
  payment_reference?: string;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        // If no user is logged in, reset subscription to null and return
        setSubscription(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setSubscription(data as Subscription);
      } catch (error: any) {
        console.error('Error fetching subscription:', error);
        toast.error(`Error loading subscription: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const incrementPresentationCount = async () => {
    if (!user || !subscription) return;

    try {
      const newCount = subscription.presentations_generated + 1;
      const free_trial_used = newCount > 0; // Mark as used after the first presentation
      
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          presentations_generated: newCount,
          free_trial_used
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSubscription(data as Subscription);
    } catch (error: any) {
      console.error('Error updating presentation count:', error);
      toast.error(`Error updating presentation count: ${error.message}`);
    }
  };

  const setPaidStatus = async () => {
    if (!user || !subscription) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          status: 'paid'
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSubscription(data as Subscription);
      toast.success('Subscription updated to paid status!');
    } catch (error: any) {
      console.error('Error updating subscription status:', error);
      toast.error(`Error updating subscription status: ${error.message}`);
    }
  };

  const canCreatePresentation = (): boolean => {
    if (!subscription) return false;
    return subscription.status === 'paid' || !subscription.free_trial_used;
  };

  return {
    subscription,
    loading,
    incrementPresentationCount,
    setPaidStatus,
    canCreatePresentation
  };
};
