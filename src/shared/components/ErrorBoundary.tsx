import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Algo salió mal
              </h1>

              {/* Description */}
              <p className="text-gray-600 mb-6">
                HomeFlow encontró un error inesperado. Por favor, recarga la página para continuar.
              </p>

              {/* Error Details (in development) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="w-full mb-6">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 mb-2">
                    Ver detalles del error
                  </summary>
                  <div className="bg-gray-100 rounded-lg p-4 text-left">
                    <p className="text-xs font-mono text-red-600 break-all">
                      {this.state.error.toString()}
                    </p>
                  </div>
                </details>
              )}

              {/* Reload Button */}
              <button
                onClick={this.handleReload}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Recargar aplicación
              </button>

              {/* Help Text */}
              <p className="text-sm text-gray-500 mt-4">
                Si el problema persiste, intenta limpiar los datos del navegador
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
