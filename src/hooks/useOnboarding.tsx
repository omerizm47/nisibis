import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getOnboardingComplete, setOnboardingComplete } from '@/storage/taskStorage';

interface OnboardingContextValue {
  /** null = henüz okunuyor, true/false = bilinen durum. */
  completed: boolean | null;
  markComplete: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    void getOnboardingComplete().then((value) => {
      if (active) setCompleted(value);
    });
    return () => {
      active = false;
    };
  }, []);

  const markComplete = useCallback(() => {
    setCompleted(true);
    void setOnboardingComplete(true);
  }, []);

  return (
    <OnboardingContext.Provider value={{ completed, markComplete }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding, OnboardingProvider içinde kullanılmalıdır.');
  }
  return ctx;
}
