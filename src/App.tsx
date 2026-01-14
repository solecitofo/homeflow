import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Onboarding
import { EmotionalStateSelection } from './features/onboarding/components/EmotionalStateSelection';
import { EmpathyScreen } from './features/onboarding/components/EmpathyScreen';
import { HomeConfigurationStart } from './features/onboarding/components/HomeConfigurationStart';
import { ConfigureRoomsStep1 } from './features/onboarding/components/ConfigureRoomsStep1';
import { ConfigureRoomsStep2 } from './features/onboarding/components/ConfigureRoomsStep2';
import { ConfigureRoomsStep3 } from './features/onboarding/components/ConfigureRoomsStep3';
import { ConfigurationSummary } from './features/onboarding/components/ConfigurationSummary';
import { FirstGuidedTask } from './features/onboarding/components/FirstGuidedTask';
import { TaskFeedback } from './features/onboarding/components/TaskFeedback';
import { OnboardingComplete } from './features/onboarding/components/OnboardingComplete';

// Home - New Adaptive Flow
import { StateSelectionScreen } from './features/home/components/StateSelectionScreen';
import { RouteOverwhelmed } from './features/home/components/RouteOverwhelmed';
import { RouteHaveEnergy } from './features/home/components/RouteHaveEnergy';
import { RouteHardToStart } from './features/home/components/RouteHardToStart';
import { RoutePlanning } from './features/home/components/RoutePlanning';
import { RouteShopping } from './features/home/components/RouteShopping';
import { HomePage } from './features/home/components/HomePage';

// Tasks
import { TaskExecutionScreen } from './features/tasks/components/TaskExecutionScreen';

// Learn
import { LearnHome } from './features/learn/components/LearnHome';
import { ArticleReader } from './features/learn/components/ArticleReader';

// Shared
import { ProtectedRoute } from './shared/components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        {/* Onboarding Flow */}
        <Route path="/onboarding" element={<EmotionalStateSelection />} />
        <Route path="/onboarding/empathy" element={<EmpathyScreen />} />
        <Route path="/onboarding/configure" element={<HomeConfigurationStart />} />
        <Route path="/onboarding/configure/step1" element={<ConfigureRoomsStep1 />} />
        <Route path="/onboarding/configure/step2" element={<ConfigureRoomsStep2 />} />
        <Route path="/onboarding/configure/step3" element={<ConfigureRoomsStep3 />} />
        <Route path="/onboarding/summary" element={<ConfigurationSummary />} />
        <Route path="/onboarding/first-task" element={<FirstGuidedTask />} />
        <Route path="/onboarding/feedback" element={<TaskFeedback />} />
        <Route path="/onboarding/complete" element={<OnboardingComplete />} />
        
        {/* NEW: Adaptive Flow Routes - Main Entry Point */}
        <Route path="/" element={<ProtectedRoute><StateSelectionScreen /></ProtectedRoute>} />
        
        {/* Adaptive Routes by User State */}
        <Route path="/flow/overwhelmed" element={<ProtectedRoute><RouteOverwhelmed /></ProtectedRoute>} />
        <Route path="/flow/energy" element={<ProtectedRoute><RouteHaveEnergy /></ProtectedRoute>} />
        <Route path="/flow/hard-to-start" element={<ProtectedRoute><RouteHardToStart /></ProtectedRoute>} />
        <Route path="/flow/planning" element={<ProtectedRoute><RoutePlanning /></ProtectedRoute>} />
        <Route path="/flow/shopping" element={<ProtectedRoute><RouteShopping /></ProtectedRoute>} />
        
        {/* Legacy Home - Still accessible */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        
        {/* Progress View */}
        <Route path="/progress" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        
        {/* Tasks */}
        <Route path="/tasks/:taskId" element={<ProtectedRoute><TaskExecutionScreen /></ProtectedRoute>} />
        
        {/* Learn */}
        <Route path="/learn" element={<ProtectedRoute><LearnHome /></ProtectedRoute>} />
        <Route path="/learn/:articleId" element={<ProtectedRoute><ArticleReader /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
