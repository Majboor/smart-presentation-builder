
import { useState, useEffect } from 'react';

export type SubscriptionStatus = 'free' | 'paid';

export interface Subscription {
  status: SubscriptionStatus;
  usedFreeTrial: boolean;
  presentationsGenerated: number;
}

const LOCAL_STORAGE_KEY = 'slideai_subscription';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription>(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      status: 'free',
      usedFreeTrial: false,
      presentationsGenerated: 0
    };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(subscription));
  }, [subscription]);

  const incrementPresentationCount = () => {
    setSubscription(prev => {
      const newCount = prev.presentationsGenerated + 1;
      const usedFreeTrial = newCount >= 1;
      
      return {
        ...prev,
        presentationsGenerated: newCount,
        usedFreeTrial
      };
    });
  };

  const setPaidStatus = () => {
    setSubscription(prev => ({
      ...prev,
      status: 'paid' as SubscriptionStatus
    }));
  };

  const canCreatePresentation = (): boolean => {
    return subscription.status === 'paid' || !subscription.usedFreeTrial;
  };

  return {
    subscription,
    incrementPresentationCount,
    setPaidStatus,
    canCreatePresentation
  };
};
