import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import type { Ingredient } from './types';
import { Header, AddModal } from './components';
import { FridgePage, RecipePage } from './pages';
import { useIngredientStore } from './store/useIngredientStore';

function App() {
  const { addIngredient, updateIngredient } = useIngredientStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  const handleEditSave = (item: Ingredient) => {
    updateIngredient(item);
    setEditingIngredient(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      <Header onAddClick={() => setShowAdd(true)} />

      <main className="max-w-300 mx-auto px-4 pt-5 pb-20 sm:px-6 sm:py-7 lg:py-8 lg:px-10">
        <Routes>
          <Route path="/"       element={<FridgePage onEdit={setEditingIngredient} />} />
          <Route path="/recipe" element={<RecipePage />} />
          <Route path="*"       element={<Navigate to="/" replace />} />
        </Routes>
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
