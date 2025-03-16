
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
  is_active: boolean;
  amount?: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  user_id: string;
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
        // First, check if a subscription exists for this user
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Use the most recent subscription if multiple exist
          const mostRecentSub = data.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];

          // Map the database fields to our Subscription interface
          setSubscription({
            id: mostRecentSub.id,
            status: mostRecentSub.status as SubscriptionStatus, // Cast to SubscriptionStatus type
            free_trial_used: mostRecentSub.free_trial_used,
            presentations_generated: mostRecentSub.presentations_generated,
            payment_reference: mostRecentSub.payment_reference,
            is_active: mostRecentSub.is_active,
            amount: mostRecentSub.amount,
            created_at: mostRecentSub.created_at,
            updated_at: mostRecentSub.updated_at,
            expires_at: mostRecentSub.expires_at,
            user_id: mostRecentSub.user_id
          });
        } else {
          // If no subscription exists, create a default one for this user
          const { data: newSub, error: createError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: user.id,
              status: 'free',
              free_trial_used: false,
              presentations_generated: 0,
              is_active: true
            })
            .select()
            .single();

          if (createError) {
            throw createError;
          }

          setSubscription({
            id: newSub.id,
            status: newSub.status as SubscriptionStatus,
            free_trial_used: newSub.free_trial_used,
            presentations_generated: newSub.presentations_generated,
            payment_reference: newSub.payment_reference,
            is_active: newSub.is_active,
            amount: newSub.amount,
            created_at: newSub.created_at,
            updated_at: newSub.updated_at,
            expires_at: newSub.expires_at,
            user_id: newSub.user_id
          });
        }
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

      // Update the local subscription object with the new data
      setSubscription({
        ...subscription,
        presentations_generated: newCount,
        free_trial_used,
        // Ensure all other fields are preserved
        id: data.id,
        status: data.status as SubscriptionStatus, // Cast to SubscriptionStatus type
        payment_reference: data.payment_reference,
        is_active: data.is_active,
        amount: data.amount,
        created_at: data.created_at,
        updated_at: data.updated_at,
        expires_at: data.expires_at,
        user_id: data.user_id
      });
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
          status: 'paid' as SubscriptionStatus
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update the local subscription object with the new data
      setSubscription({
        ...subscription,
        status: 'paid',
        // Ensure all other fields are preserved
        id: data.id,
        free_trial_used: data.free_trial_used,
        presentations_generated: data.presentations_generated,
        payment_reference: data.payment_reference,
        is_active: data.is_active,
        amount: data.amount,
        created_at: data.created_at,
        updated_at: data.updated_at,
        expires_at: data.expires_at,
        user_id: data.user_id
      });
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
