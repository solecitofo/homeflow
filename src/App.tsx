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

// Placeholder para home (temporal)
const HomePage = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">🏠 HomeFlow</h1>
      <p className="text-gray-600 mb-8">Pantalla principal en construcción</p>
      <p className="text-sm text-gray-500">
        El onboarding está completo. Esta será la pantalla principal donde<br/>
        los usuarios elegirán su estado emocional para recibir sugerencias.
      </p>
    </div>
  </div>
);

// Placeholder para learn (temporal)
const LearnPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">💡 Aprende</h1>
      <p className="text-gray-600 mb-8">Sección educativa en construcción</p>
      <p className="text-sm text-gray-500">
        Aquí irán los artículos sobre activación conductual,<br/>
        psicología del comportamiento y creación de hábitos.
      </p>
    </div>
  </div>
);

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
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:articleId" element={<LearnPage />} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
