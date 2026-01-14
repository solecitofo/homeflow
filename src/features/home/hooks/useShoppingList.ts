import { useState, useEffect, useCallback } from 'react';
import {
  getOrCreateShoppingList,
  addShoppingItem,
  toggleShoppingItem,
  removeShoppingItem,
  clearCheckedItems,
  getShoppingSuggestions,
} from '../../../db/operations/shoppingList';
import type { ShoppingList, ShoppingItem } from '../../../db/database';

export function useShoppingList(userId: string) {
  const [list, setList] = useState<ShoppingList | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar lista al montar
  useEffect(() => {
    loadList();
  }, [userId]);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const shoppingList = await getOrCreateShoppingList(userId);
      setList(shoppingList);
      
      // Cargar sugerencias
      const sug = await getShoppingSuggestions(userId);
      setSuggestions(sug);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addItem = useCallback(async (
    name: string,
    category: ShoppingItem['category'],
    _quantity?: number
  ) => {
    try {
      await addShoppingItem(userId, name, category);
      await loadList(); // Recargar lista
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al agregar';
      setError(message);
      return false;
    }
  }, [userId, loadList]);

  const toggleItem = useCallback(async (itemId: string) => {
    try {
      await toggleShoppingItem(userId, itemId);
      await loadList();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar';
      setError(message);
    }
  }, [userId, loadList]);

  const removeItemFromList = useCallback(async (itemId: string) => {
    try {
      await removeShoppingItem(userId, itemId);
      await loadList();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar';
      setError(message);
    }
  }, [userId, loadList]);

  const clearChecked = useCallback(async () => {
    try {
      await clearCheckedItems(userId);
      await loadList();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al limpiar';
      setError(message);
    }
  }, [userId, loadList]);

  // Agrupar items por categoría
  const itemsByCategory = list?.items.reduce((acc, item) => {
    const category = item.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof list.items>) || {};

  // Estadísticas
  const stats = {
    total: list?.items.length || 0,
    checked: list?.items.filter(i => i.checked).length || 0,
    pending: list?.items.filter(i => !i.checked).length || 0,
  };

  return {
    list,
    itemsByCategory,
    suggestions,
    stats,
    loading,
    error,
    addItem,
    toggleItem,
    removeItem: removeItemFromList,
    clearChecked,
    refresh: loadList,
  };
}
