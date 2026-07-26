import { useState, lazy, Suspense, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import type { Ingredient } from './types';
import { Header, AddModal, ErrorBoundary } from './components';
import { useIngredientStore } from './store/useIngredientStore';

const FridgePage = lazy(() => import('./pages/FridgePage').then(m => ({ default: m.FridgePage })));
const RecipePage = lazy(() => import('./pages/RecipePage').then(m => ({ default: m.RecipePage })));
const ShoppingListPage = lazy(() => import('./pages/ShoppingListPage').then(m => ({ default: m.ShoppingListPage })));

function App() {
  const { addIngredient, updateIngredient } = useIngredientStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  const handleEditSave = useCallback((item: Ingredient) => {
    updateIngredient(item);
    setEditingIngredient(null);
  }, [updateIngredient]);

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      <Header onAddClick={() => setShowAdd(true)} />

      <main className="max-w-300 mx-auto px-4 pt-5 pb-20 sm:px-6 sm:py-7 lg:py-8 lg:px-10">
        <Suspense fallback={<div className="flex justify-center py-20 text-gray-400 text-sm">불러오는 중...</div>}>
          <Routes>
            <Route path="/"         element={<ErrorBoundary><FridgePage onEdit={setEditingIngredient} /></ErrorBoundary>} />
            <Route path="/recipe"   element={<ErrorBoundary><RecipePage /></ErrorBoundary>} />
            <Route path="/shopping" element={<ErrorBoundary><ShoppingListPage /></ErrorBoundary>} />
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {showAdd && (
        <AddModal onClose={() => setShowAdd(false)} onAdd={addIngredient} />
      )}
      {editingIngredient && (
        <AddModal
          onClose={() => setEditingIngredient(null)}
          onEdit={handleEditSave}
          initialIngredient={editingIngredient}
        />
      )}
    </div>
  );
}

export default App;
