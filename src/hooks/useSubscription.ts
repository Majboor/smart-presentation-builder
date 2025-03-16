
import { useState, useEffect, useRef } from 'react';
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
  const errorShown = useRef(false);
  const fetchAttempted = useRef(false);
  const isCreatingSubscription = useRef(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      if (errorShown.current) return;

      try {
        // First, check if a subscription already exists for this user
        const { data: existingData, error: existingError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id);

        if (existingError) {
          throw existingError;
        }

        if (existingData && existingData.length > 0) {
          // Use the most recent subscription if multiple exist
          const mostRecentSub = existingData.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];

          setSubscription({
            id: mostRecentSub.id,
            status: mostRecentSub.status as SubscriptionStatus,
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
          // No subscription exists, create one if we haven't already started the process
          if (isCreatingSubscription.current) {
            return; // Prevent duplicate creation attempts
          }
          
          isCreatingSubscription.current = true;
          
          // Double-check that a subscription doesn't exist before creating one
          // This helps prevent race conditions in concurrent requests
          const { count: subscriptionCount, error: countError } = await supabase
            .from('subscriptions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
            
          if (countError) {
            throw countError;
          }
          
          if (subscriptionCount === 0) {
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
              // If we get a duplicate key error here, try to fetch the existing subscription
              if (createError.code === '23505') {
                const { data: retryData, error: retryError } = await supabase
                  .from('subscriptions')
                  .select('*')
                  .eq('user_id', user.id)
                  .single();
                  
                if (retryError) {
                  throw retryError;
                }
                
                if (retryData) {
                  setSubscription({
                    id: retryData.id,
                    status: retryData.status as SubscriptionStatus,
                    free_trial_used: retryData.free_trial_used,
                    presentations_generated: retryData.presentations_generated,
                    payment_reference: retryData.payment_reference,
                    is_active: retryData.is_active,
                    amount: retryData.amount,
                    created_at: retryData.created_at,
                    updated_at: retryData.updated_at,
                    expires_at: retryData.expires_at,
                    user_id: retryData.user_id
                  });
                  isCreatingSubscription.current = false;
                  return;
                }
              }
              throw createError;
            }

            if (newSub) {
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
          } else {
            // If we reach here, a subscription was created after our initial check
            const { data: latestSub, error: fetchError } = await supabase
              .from('subscriptions')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
              
            if (fetchError) {
              throw fetchError;
            }
            
            if (latestSub) {
              setSubscription({
                id: latestSub.id,
                status: latestSub.status as SubscriptionStatus,
                free_trial_used: latestSub.free_trial_used,
                presentations_generated: latestSub.presentations_generated,
                payment_reference: latestSub.payment_reference,
                is_active: latestSub.is_active,
                amount: latestSub.amount,
                created_at: latestSub.created_at,
                updated_at: latestSub.updated_at,
                expires_at: latestSub.expires_at,
                user_id: latestSub.user_id
              });
            }
          }
          
          isCreatingSubscription.current = false;
        }
        
        fetchAttempted.current = true;
      } catch (error: any) {
        console.error('Error fetching subscription:', error);
        
        if (!errorShown.current) {
          toast.error(`Error loading subscription: ${error.message}`);
          errorShown.current = true;
        }
        
        if (!subscription && fetchAttempted.current === false) {
          const fallbackSubscription: Subscription = {
            id: 'fallback',
            status: 'free',
            free_trial_used: false,
            presentations_generated: 0,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: user.id
          };
          setSubscription(fallbackSubscription);
          fetchAttempted.current = true;
        }
        
        isCreatingSubscription.current = false;
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      errorShown.current = false;
    }
    
    fetchSubscription();
  }, [user]);

  useEffect(() => {
    if (user) {
      errorShown.current = false;
      fetchAttempted.current = false;
      isCreatingSubscription.current = false;
    }
  }, [user]);

  const incrementPresentationCount = async () => {
    if (!user || !subscription) return;

    try {
      const newCount = subscription.presentations_generated + 1;
      const free_trial_used = newCount >= 1;
      
      setSubscription({
        ...subscription,
        presentations_generated: newCount,
        free_trial_used
      });
      
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
        console.error('Error updating presentation count:', error);
        return;
      }

      if (data) {
        setSubscription({
          ...subscription,
          presentations_generated: data.presentations_generated,
          free_trial_used: data.free_trial_used,
          updated_at: data.updated_at
        });
      }
    } catch (error: any) {
      console.error('Error updating presentation count:', error);
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

      setSubscription({
        ...subscription,
        status: 'paid',
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
    
    return subscription.status === 'paid' || subscription.presentations_generated === 0;
  };

  return {
    subscription,
    loading,
    incrementPresentationCount,
    setPaidStatus,
    canCreatePresentation
  };
};
