import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Trash2, ShoppingCart, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { useShoppingList } from '../hooks/useShoppingList';
import type { ShoppingItem } from '../../../db/database';

// TODO: Obtener userId del store/auth
const TEMP_USER_ID = 'default-user';

// Categorías de compra con items sugeridos
const shoppingCategories: {
  id: ShoppingItem['category'];
  name: string;
  icon: string;
  suggestions: string[];
}[] = [
  {
    id: 'fresh',
    name: 'Frescos',
    icon: '🥬',
    suggestions: ['Leche', 'Huevos', 'Pan', 'Fruta', 'Verdura', 'Carne', 'Pescado'],
  },
  {
    id: 'pantry',
    name: 'Despensa',
    icon: '🥫',
    suggestions: ['Arroz', 'Pasta', 'Aceite', 'Sal', 'Legumbres', 'Conservas'],
  },
  {
    id: 'frozen',
    name: 'Congelados',
    icon: '🧊',
    suggestions: ['Verduras congeladas', 'Pizza', 'Helado', 'Pescado congelado'],
  },
  {
    id: 'cleaning',
    name: 'Limpieza',
    icon: '🧹',
    suggestions: ['Jabón', 'Detergente', 'Papel higiénico', 'Bolsas basura', 'Lejía'],
  },
  {
    id: 'hygiene',
    name: 'Higiene',
    icon: '🧴',
    suggestions: ['Champú', 'Gel ducha', 'Pasta dientes', 'Desodorante'],
  },
  {
    id: 'other',
    name: 'Otros',
    icon: '📦',
    suggestions: ['Pilas', 'Bombillas', 'Medicinas'],
  },
];

type Phase = 'method' | 'quick' | 'category' | 'list' | 'done';

export const RouteShopping: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('method');
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShoppingItem['category'] | null>(null);

  // Hook de persistencia
  const {
    list,
    itemsByCategory,
    suggestions,
    stats,
    loading,
    error,
    addItem: addItemToDb,
    toggleItem: toggleItemDb,
    removeItem: removeItemDb,
    clearChecked,
    refresh,
  } = useShoppingList(TEMP_USER_ID);

  const items: ShoppingItem[] = list?.items || [];

  const addItem = async (name: string, category: ShoppingItem['category'] = 'other') => {
    if (!name.trim()) return;
    await addItemToDb(name.trim(), category);
    setNewItemText('');
  };

  const toggleItem = async (id: string) => {
    await toggleItemDb(id);
  };

  const removeItem = async (id: string) => {
    await removeItemDb(id);
  };

  const handleQuickAdd = async (suggestion: string, category: ShoppingItem['category']) => {
    if (!items.some(item => item.name.toLowerCase() === suggestion.toLowerCase())) {
      await addItem(suggestion, category);
    }
  };

  const checkedCount = stats.checked;

  // Mostrar loader mientras carga
  if (loading && !list) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-primary-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-primary-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => {
            if (phase === 'method') navigate('/');
            else if (phase === 'category') setPhase('quick');
            else if (phase === 'list') setPhase('quick');
            else setPhase('method');
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 mt-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </motion.button>

        <AnimatePresence mode="wait">
          {/* PHASE: Select Method */}
          {phase === 'method' && (
            <motion.div
              key="method"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="text-6xl mb-4"
                >
                  🛒
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Lista de la compra
                </h1>
                <p className="text-lg text-gray-600">
                  ¿Cómo quieres hacerla?
                </p>
              </div>

              <div className="space-y-3">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPhase('quick')}
                  className="w-full bg-white rounded-xl p-5 shadow-sm border-2 border-gray-200 
                           hover:border-green-400 transition-all flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-gray-800">Ayudada por categorías</p>
                    <p className="text-sm text-gray-500">Te sugiero productos por sección</p>
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPhase('list')}
                  className="w-full bg-white rounded-xl p-5 shadow-sm border-2 border-gray-200 
                           hover:border-green-400 transition-all flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-gray-800">Lista libre</p>
                    <p className="text-sm text-gray-500">Añade lo que necesites</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* PHASE: Quick Add by Category */}
          {phase === 'quick' && (
            <motion.div
              key="quick"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Elige por categoría
                </h2>
                {items.length > 0 && (
                  <button
                    onClick={() => setPhase('list')}
                    className="flex items-center gap-2 text-green-600 font-medium"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {items.length}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {shoppingCategories.map((cat, index) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setPhase('category');
                    }}
                    className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-200 
                             hover:border-green-300 transition-all flex flex-col items-center gap-2"
                  >
                    <span className="text-3xl">{cat.icon}</span>
                    <span className="font-medium text-gray-700">{cat.name}</span>
                  </motion.button>
                ))}
              </div>

              {items.length > 0 && (
                <Button onClick={() => setPhase('list')} className="w-full">
                  Ver mi lista ({items.length} items)
                </Button>
              )}
            </motion.div>
          )}

          {/* PHASE: Category Items */}
          {phase === 'category' && selectedCategory && (
            <motion.div
              key="category"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {(() => {
                const category = shoppingCategories.find(c => c.id === selectedCategory);
                if (!category) return null;

                return (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-4xl">{category.icon}</span>
                      <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
                    </div>

                    <p className="text-gray-600 mb-4">Toca para añadir a la lista:</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {category.suggestions.map((suggestion) => {
                        const isAdded = items.some(
                          item => item.name.toLowerCase() === suggestion.toLowerCase()
                        );
                        return (
                          <motion.button
                            key={suggestion}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleQuickAdd(suggestion, category.id)}
                            className={`
                              px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2
                              ${isAdded
                                ? 'bg-green-100 border-green-300 text-green-700'
                                : 'bg-white border-gray-200 hover:border-green-300'
                              }
                            `}
                          >
                            {isAdded && <Check className="w-4 h-4" />}
                            {suggestion}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Custom item input */}
                    <div className="flex gap-2 mb-6">
                      <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addItem(newItemText, category.id);
                          }
                        }}
                        placeholder="Añadir otro..."
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 
                                 focus:border-green-400 focus:outline-none"
                      />
                      <Button
                        onClick={() => addItem(newItemText, category.id)}
                        disabled={!newItemText.trim()}
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setPhase('quick')}
                        className="flex-1"
                      >
                        Más categorías
                      </Button>
                      <Button onClick={() => setPhase('list')} className="flex-1">
                        Ver lista
                      </Button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}

          {/* PHASE: Full List View */}
          {phase === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Mi lista de la compra
                </h2>
                <span className="text-gray-500">
                  {checkedCount}/{items.length}
                </span>
              </div>

              {/* Add new item */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addItem(newItemText);
                  }}
                  placeholder="Añadir item..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 
                           focus:border-green-400 focus:outline-none"
                />
                <Button onClick={() => addItem(newItemText)} disabled={!newItemText.trim()}>
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-5xl mb-4 block">📝</span>
                  <p className="text-gray-500">Tu lista está vacía</p>
                  <Button
                    variant="outline"
                    onClick={() => setPhase('quick')}
                    className="mt-4"
                  >
                    Añadir por categorías
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 mb-6">
                  {items.map((item) => {
                    const category = shoppingCategories.find(c => c.id === item.category);
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`
                          flex items-center gap-3 p-3 rounded-xl bg-white border-2 transition-all
                          ${item.checked ? 'border-green-200 bg-green-50' : 'border-gray-200'}
                        `}
                      >
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={`
                            w-6 h-6 rounded-full flex items-center justify-center transition-colors
                            ${item.checked
                              ? 'bg-green-500 text-white'
                              : 'border-2 border-gray-300'
                            }
                          `}
                        >
                          {item.checked && <Check className="w-4 h-4" />}
                        </button>
                        <span className="text-lg">{category?.icon || '📦'}</span>
                        <span
                          className={`flex-1 ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}
                        >
                          {item.name}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Eliminar item"
                          aria-label="Eliminar item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {items.length > 0 && checkedCount === items.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-100 rounded-xl p-6 text-center mb-6"
                >
                  <span className="text-5xl mb-2 block">🎉</span>
                  <p className="font-bold text-green-800">¡Compra completada!</p>
                </motion.div>
              )}

              <Button
                variant="outline"
                onClick={() => setPhase('quick')}
                className="w-full"
              >
                Añadir más por categorías
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
