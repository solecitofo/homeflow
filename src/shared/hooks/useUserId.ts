import { useAppStore } from '../../../store';

/**
 * Hook para obtener el userId actual
 * Retorna 'default-user' si no hay usuario autenticado
 */
export function useUserId(): string {
  const userId = useAppStore((state) => state.userId);
  return userId || 'default-user';
}
