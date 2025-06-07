import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpensesContext';
import { Edit, Trash2, Plus } from 'lucide-react';
import CategoryForm from './CategoryForm';

const CategoriesList: React.FC = () => {
  const { categories, deleteCategory } = useExpenses();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  
  const handleEditCategory = (id: string) => {
    setEditingCategory(id);
    setIsAddingCategory(false);
  };
  
  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };
  
  const handleCategoryFormClose = () => {
    setIsAddingCategory(false);
    setEditingCategory(null);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Expense Categories
          </h2>
          <button
            onClick={() => {
              setIsAddingCategory(true);
              setEditingCategory(null);
            }}
            className="btn btn-primary flex items-center text-sm"
          >
            <Plus size={16} className="mr-1" />
            Add Category
          </button>
        </div>
      </div>
      
      {(isAddingCategory || editingCategory) && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <CategoryForm
            mode={editingCategory ? 'edit' : 'add'}
            categoryId={editingCategory}
            onClose={handleCategoryFormClose}
          />
        </div>
      )}
      
      <div className="p-6">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between transition-all hover:shadow-md"
              >
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-white font-bold">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {category.name}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCategory(category.id)}
                    className="p-1 text-gray-500 hover:text-accent-500 dark:text-gray-400 dark:hover:text-accent-400 transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No categories found. Add your first category to get started.
            </p>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="btn btn-primary"
            >
              Add Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesList;