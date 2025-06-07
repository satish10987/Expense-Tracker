import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExpenses } from '../../context/ExpensesContext';
import { Calendar, DollarSign, Tag, AlignLeft, ArrowLeft } from 'lucide-react';
import { Expense } from '../../types';

interface ExpenseFormProps {
  mode: 'add' | 'edit';
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { expenses, categories, addExpense, updateExpense } = useExpenses();
  
  const [formData, setFormData] = useState<Omit<Expense, 'id'> & { id?: string }>({
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    categoryId: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState({
    amount: '',
    description: '',
    categoryId: '',
  });
  
  // If editing, fetch the expense data
  useEffect(() => {
    if (mode === 'edit' && id) {
      const expenseToEdit = expenses.find(expense => expense.id === id);
      if (expenseToEdit) {
        setFormData({
          ...expenseToEdit,
          // Convert the date format if necessary
          date: new Date(expenseToEdit.date).toISOString().split('T')[0],
        });
      } else {
        navigate('/expenses');
      }
    }
  }, [mode, id, expenses, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, amount: isNaN(value) ? 0 : value }));
    
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors = {
      amount: '',
      description: '',
      categoryId: '',
    };
    
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (mode === 'add') {
      addExpense(formData);
    } else if (mode === 'edit' && id) {
      updateExpense({ ...formData, id } as Expense);
    }
    
    navigate('/expenses');
  };
  
  return (
    <div className="animate-fade-in">
      <button 
        onClick={() => navigate('/expenses')} 
        className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Expenses
      </button>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {mode === 'add' ? 'Add New Expense' : 'Edit Expense'}
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleAmountChange}
                  className={`input pl-10 ${errors.amount ? 'border-error-500 focus:ring-error-500' : ''}`}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-error-500">{errors.amount}</p>
              )}
            </div>
            
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input pl-10"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`input ${errors.description ? 'border-error-500 focus:ring-error-500' : ''}`}
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error-500">{errors.description}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag size={18} className="text-gray-400" />
              </div>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className={`input pl-10 ${errors.categoryId ? 'border-error-500 focus:ring-error-500' : ''}`}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-error-500">{errors.categoryId}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                <AlignLeft size={18} className="text-gray-400" />
              </div>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={3}
                className="input pl-10"
                placeholder="Add any additional details about this expense..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/expenses')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {mode === 'add' ? 'Add Expense' : 'Update Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;