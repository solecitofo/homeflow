import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { seedTasksIfNeeded } from './db/seed/taskLibrary';
import { ErrorBoundary } from './shared/components/ErrorBoundary';

// Inicializar base de datos con tareas si es necesario
seedTasksIfNeeded().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
