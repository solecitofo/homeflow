import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerReturn {
  seconds: number;
  minutes: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  resume: () => void;
}

/**
 * Hook personalizado para manejar un timer
 * @param initialSeconds - Segundos iniciales (default: 0, cuenta hacia arriba)
 * @param countDown - Si true, cuenta hacia abajo desde initialSeconds
 */
export function useTimer(initialSeconds: number = 0, countDown: boolean = false): UseTimerReturn {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Manejar el timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          if (countDown) {
            // Cuenta regresiva
            if (prev <= 0) {
              setIsRunning(false);
              if (intervalRef.current) clearInterval(intervalRef.current);
              return 0;
            }
            return prev - 1;
          } else {
            // Cuenta progresiva
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, countDown]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  const resume = useCallback(() => {
    setIsRunning(true);
  }, []);

  const minutes = Math.floor(seconds / 60);

  return {
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    reset,
    resume,
  };
}

/**
 * Formatea segundos a formato MM:SS
 */
export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
