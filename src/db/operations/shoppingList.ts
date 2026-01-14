import { db, type ShoppingList, type ShoppingItem, type FrequentItem, generateId } from '../database';

// ============================================================================
// OPERACIONES CRUD PARA LISTA DE COMPRAS
// ============================================================================

/**
 * Obtiene o crea la lista de compras del usuario
 */
export async function getOrCreateShoppingList(userId: string): Promise<ShoppingList> {
  let list = await db.shoppingLists.get(userId);
  
  if (!list) {
    list = {
      userId,
      items: [],
      lastModified: new Date(),
    };
    await db.shoppingLists.add(list);
  }
  
  return list;
}

/**
 * Añade un item a la lista de compras
 */
export async function addShoppingItem(
  userId: string,
  name: string,
  category: ShoppingItem['category'] = 'other',
  addedBy: 'user' | 'suggestion' = 'user'
): Promise<ShoppingItem> {
  const list = await getOrCreateShoppingList(userId);
  
  // Verificar si ya existe
  const existing = list.items.find(
    item => item.name.toLowerCase() === name.toLowerCase()
  );
  
  if (existing) {
    // Si ya existe pero está marcado, desmarcarlo
    if (existing.checked) {
      existing.checked = false;
      await db.shoppingLists.update(userId, {
        items: list.items,
        lastModified: new Date(),
      });
    }
    return existing;
  }
  
  // Crear nuevo item
  const newItem: ShoppingItem = {
    id: generateId(),
    name: name.trim(),
    category,
    addedAt: new Date(),
    addedBy,
    checked: false,
  };
  
  list.items.push(newItem);
  
  await db.shoppingLists.update(userId, {
    items: list.items,
    lastModified: new Date(),
  });
  
  return newItem;
}

/**
 * Marca/desmarca un item como comprado
 */
export async function toggleShoppingItem(
  userId: string,
  itemId: string
): Promise<void> {
  const list = await getOrCreateShoppingList(userId);
  
  const item = list.items.find(i => i.id === itemId);
  if (!item) return;
  
  item.checked = !item.checked;
  
  // Si se marca como comprado, actualizar frecuencia
  if (item.checked) {
    await updateFrequentItem(userId, item.name, item.category);
  }
  
  await db.shoppingLists.update(userId, {
    items: list.items,
    lastModified: new Date(),
  });
}

/**
 * Elimina un item de la lista
 */
export async function removeShoppingItem(
  userId: string,
  itemId: string
): Promise<void> {
  const list = await getOrCreateShoppingList(userId);
  
  list.items = list.items.filter(i => i.id !== itemId);
  
  await db.shoppingLists.update(userId, {
    items: list.items,
    lastModified: new Date(),
  });
}

/**
 * Limpia items marcados como comprados
 */
export async function clearCheckedItems(userId: string): Promise<void> {
  const list = await getOrCreateShoppingList(userId);
  
  list.items = list.items.filter(i => !i.checked);
  
  await db.shoppingLists.update(userId, {
    items: list.items,
    lastModified: new Date(),
  });
}

// ============================================================================
// ITEMS FRECUENTES Y SUGERENCIAS
// ============================================================================

/**
 * Actualiza el historial de un item frecuente
 */
async function updateFrequentItem(
  userId: string,
  name: string,
  category: ShoppingItem['category']
): Promise<void> {
  const key: [string, string] = [userId, name.toLowerCase()];
  let frequent = await db.frequentItems.get(key);
  
  if (frequent) {
    // Calcular promedio de días entre compras
    const daysSinceLast = frequent.lastPurchased
      ? Math.floor((Date.now() - new Date(frequent.lastPurchased).getTime()) / (1000 * 60 * 60 * 24))
      : 7; // Default 7 días
    
    const newAverage = frequent.purchaseCount > 0
      ? (frequent.averageDaysBetweenPurchases * frequent.purchaseCount + daysSinceLast) / (frequent.purchaseCount + 1)
      : daysSinceLast;
    
    await db.frequentItems.update(key, {
      purchaseCount: frequent.purchaseCount + 1,
      averageDaysBetweenPurchases: Math.round(newAverage),
      lastPurchased: new Date(),
    });
  } else {
    // Crear nuevo registro
    const newFrequent: FrequentItem = {
      userId,
      name: name.toLowerCase(),
      category,
      purchaseCount: 1,
      averageDaysBetweenPurchases: 7, // Default inicial
      lastPurchased: new Date(),
    };
    await db.frequentItems.add(newFrequent);
  }
}

/**
 * Obtiene sugerencias inteligentes basadas en historial
 */
export async function getShoppingSuggestions(userId: string): Promise<string[]> {
  const list = await getOrCreateShoppingList(userId);
  const frequentItems = await db.frequentItems
    .where('userId')
    .equals(userId)
    .toArray();
  
  const suggestions: string[] = [];
  const currentItemNames = list.items.map(i => i.name.toLowerCase());
  
  // Iterar sobre items frecuentes
  for (const item of frequentItems) {
    // Saltar si ya está en la lista
    if (currentItemNames.includes(item.name)) continue;
    
    // Calcular días desde última compra
    const daysSinceLast = item.lastPurchased
      ? Math.floor((Date.now() - new Date(item.lastPurchased).getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    
    // Sugerir si han pasado los días promedio - 2 (margen)
    if (daysSinceLast >= item.averageDaysBetweenPurchases - 2) {
      suggestions.push(item.name);
    }
  }
  
  // Limitar a 10 sugerencias, ordenadas por urgencia
  return suggestions.slice(0, 10);
}

/**
 * Obtiene los items más frecuentes del usuario
 */
export async function getTopFrequentItems(
  userId: string,
  limit: number = 10
): Promise<FrequentItem[]> {
  const items = await db.frequentItems
    .where('userId')
    .equals(userId)
    .toArray();
  
  // Ordenar por frecuencia de compra
  items.sort((a, b) => b.purchaseCount - a.purchaseCount);
  
  return items.slice(0, limit);
}

// ============================================================================
// BÁSICOS SUGERIDOS
// ============================================================================

const ESSENTIAL_ITEMS = [
  { name: 'Leche', category: 'fresh' as const },
  { name: 'Pan', category: 'fresh' as const },
  { name: 'Huevos', category: 'fresh' as const },
  { name: 'Agua', category: 'pantry' as const },
  { name: 'Fruta', category: 'fresh' as const },
  { name: 'Verdura', category: 'fresh' as const },
];

/**
 * Sugiere básicos que podrían faltar
 */
export async function suggestEssentials(userId: string): Promise<string[]> {
  const list = await getOrCreateShoppingList(userId);
  const suggestions: string[] = [];
  
  const currentItemNames = list.items.map(i => i.name.toLowerCase());
  
  for (const essential of ESSENTIAL_ITEMS) {
    // Verificar si ya está en la lista
    if (currentItemNames.some(name => name.includes(essential.name.toLowerCase()))) {
      continue;
    }
    
    // Verificar si fue comprado recientemente
    const key: [string, string] = [userId, essential.name.toLowerCase()];
    const frequent = await db.frequentItems.get(key);
    
    if (frequent?.lastPurchased) {
      const daysSince = Math.floor(
        (Date.now() - new Date(frequent.lastPurchased).getTime()) / (1000 * 60 * 60 * 24)
      );
      // Solo sugerir si han pasado más de 3 días
      if (daysSince <= 3) continue;
    }
    
    suggestions.push(essential.name);
  }
  
  return suggestions;
}
