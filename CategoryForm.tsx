import React, { useState, useEffect } from 'react';
import { useExpenses } from '../../context/ExpensesContext';
import { Category } from '../../types';
import { X, Check } from 'lucide-react';

interface CategoryFormProps {
  mode: 'add' | 'edit';
  categoryId?: string | null;
  onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ mode, categoryId, onClose }) => {
  const { categories, addCategory, updateCategory } = useExpenses();
  
  const [formData, setFormData] = useState<Omit<Category, 'id'> & { id?: string }>({
    name: '',
    color: '#0D9488',
    icon: 'tag',
  });
  
  const [error, setError] = useState('');
  
  // Predefined colors
  const colorOptions = [
    '#0D9488', // primary teal
    '#8B5CF6', // accent purple
    '#F59E0B', // warning yellow
    '#EF4444', // error red
    '#10B981', // success green
    '#3B82F6', // blue
    '#EC4899', // pink
    '#6B7280', // gray
  ];
  
  // If editing, fetch the category data
  useEffect(() => {
    if (mode === 'edit' && categoryId) {
      const categoryToEdit = categories.find(cat => cat.id === categoryId);
      if (categoryToEdit) {
        setFormData({ ...categoryToEdit });
      }
    }
  }, [mode, categoryId, categories]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }
    
    if (mode === 'add') {
      // Check if a category with this name already exists
      if (categories.some(cat => cat.name.toLowerCase() === formData.name.toLowerCase())) {
        setError('A category with this name already exists');
        return;
      }
      addCategory(formData);
    } else if (mode === 'edit' && formData.id) {
      // Check if another category (not this one) has the same name
      if (categories.some(cat => cat.id !== formData.id && cat.name.toLowerCase() === formData.name.toLowerCase())) {
        setError('A category with this name already exists');
        return;
      }
      updateCategory(formData as Category);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
        {mode === 'add' ? 'Add New Category' : 'Edit Category'}
      </h3>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`input ${error ? 'border-error-500 focus:ring-error-500' : ''}`}
          placeholder="e.g., Groceries, Transportation"
          required
        />
        {error && (
          <p className="mt-1 text-sm text-error-500">{error}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category Color
        </label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color}
              type="button"
              style={{ backgroundColor: color }}
              className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all ${
                formData.color === color ? 'ring-2 ring-offset-2 ring-gray-500' : ''
              }`}
              onClick={() => handleColorSelect(color)}
              aria-label={`Select color ${color}`}
            >
              {formData.color === color && <Check size={16} className="text-white mx-auto" />}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary flex items-center"
        >
          <X size={18} className="mr-1" />
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary flex items-center"
        >
          <Check size={18} className="mr-1" />
          {mode === 'add' ? 'Add Category' : 'Update Category'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;