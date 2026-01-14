import { create } from 'zustand';
import type { EmotionalState, OnboardingData } from './src/db/database';

interface AppState {
  // Usuario
  userId: string;
  
  // Onboarding
  onboardingStep: number;
  emotionalState: EmotionalState | null;
  onboardingData: Partial<OnboardingData>;
  
  // Home Screen
  dailyEmotionalState: EmotionalState | null;
  lastEmotionalCheckDate: Date | null;
  
  // Task Execution
  currentTaskId: string | null;
  
  // UI
  isLoading: boolean;
  
  // Actions
  setUserId: (id: string) => void;
  setOnboardingStep: (step: number) => void;
  setEmotionalState: (state: EmotionalState) => void;
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
  setDailyEmotionalState: (state: EmotionalState) => void;
  setCurrentTaskId: (taskId: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Estado inicial
  userId: '',
  onboardingStep: 0,
  emotionalState: null,
  onboardingData: {},
  dailyEmotionalState: null,
  lastEmotionalCheckDate: null,
  currentTaskId: null,
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
  
  setDailyEmotionalState: (state) => set({
    dailyEmotionalState: state,
    lastEmotionalCheckDate: new Date(),
  }),
  
  setCurrentTaskId: (taskId) => set({ currentTaskId: taskId }),
  
  setLoading: (loading) => set({ isLoading: loading }),
}));