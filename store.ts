import { create } from 'zustand';
import type { EmotionalState, OnboardingData } from './src/db/database';

interface AppState {
  // Usuario
  userId: string;
  
  // Onboarding
  onboardingStep: number;
  emotionalState: EmotionalState | null;
  onboardingData: Partial<OnboardingData>;
  
  // UI
  isLoading: boolean;
  
  // Actions
  setUserId: (id: string) => void;
  setOnboardingStep: (step: number) => void;
  setEmotionalState: (state: EmotionalState) => void;
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Estado inicial
  userId: 'default_user', // En producción, vendría de auth
  onboardingStep: 0,
  emotionalState: null,
  onboardingData: {},
  isLoading: false,
  
  // Actions
  setUserId: (id) => set({ userId: id }),
  
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  
  setEmotionalState: (state) => set((prev) => ({ 
    emotionalState: state,
    onboardingData: { ...prev.onboardingData, emotionalState: state }
  })),
  
  setOnboardingData: (data) => set((state) => ({
    onboardingData: { ...state.onboardingData, ...data }
  })),
  
  resetOnboarding: () => set({
    onboardingStep: 0,
    emotionalState: null,
    onboardingData: {},
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
}));
