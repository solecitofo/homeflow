import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { seedTasksIfNeeded } from './db/seed/taskLibrary';

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
import { ProgressScreen } from './features/home/components/ProgressScreen';
import { HomePage } from './features/home/components/HomePage';
import { RoomOverviewScreen } from './features/home/components/RoomOverviewScreen';
import { RoomDetailScreen } from './features/home/components/RoomDetailScreen';

// Tasks
import { TaskExecutionScreen } from './features/tasks/components/TaskExecutionScreen';
import { TaskExecutionFlow } from './features/tasks/components/TaskExecutionFlow';
import { MyCustomTasks } from './features/tasks/components/MyCustomTasks';

// Learn
import { LearnHome } from './features/learn/components/LearnHome';
import { ArticleReader } from './features/learn/components/ArticleReader';

// Shared
import { ProtectedRoute } from './shared/components/ProtectedRoute';

function App() {
  // Seed tasks automáticamente al iniciar la app
  useEffect(() => {
    seedTasksIfNeeded().catch(error => {
      console.error('Error during app initialization seed:', error);
    });
  }, []);

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
        
        {/* Progress View */}
        <Route path="/progress" element={<ProtectedRoute><ProgressScreen /></ProtectedRoute>} />
        
        {/* Room Views - Pantalla 9 y 11 */}
        <Route path="/rooms" element={<ProtectedRoute><RoomOverviewScreen /></ProtectedRoute>} />
        <Route path="/rooms/:roomId" element={<ProtectedRoute><RoomDetailScreen /></ProtectedRoute>} />

        {/* Legacy Home - Deprecated (use StateSelectionScreen at "/" instead) */}
        {/* <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} /> */}
        
        {/* Tasks */}
        <Route path="/task/execute" element={<ProtectedRoute><TaskExecutionFlow /></ProtectedRoute>} />
        <Route path="/tasks/:taskId" element={<ProtectedRoute><TaskExecutionScreen /></ProtectedRoute>} />
        <Route path="/my-tasks" element={<ProtectedRoute><MyCustomTasks /></ProtectedRoute>} />
        
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
