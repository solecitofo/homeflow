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
import { OnboardingComplete } from './features/onboarding/components/OnboardingComplete';

// Home
import { HomePage } from './features/home/components/HomePage';

// Tasks
import { TaskExecutionScreen } from './features/tasks/components/TaskExecutionScreen';

// Learn
import { LearnHome } from './features/learn/components/LearnHome';
import { ArticleReader } from './features/learn/components/ArticleReader';

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
        <Route path="/onboarding/complete" element={<OnboardingComplete />} />
        
        {/* Main App */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/tasks/:taskId" element={<TaskExecutionScreen />} />
        <Route path="/learn" element={<LearnHome />} />
        <Route path="/learn/:articleId" element={<ArticleReader />} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
