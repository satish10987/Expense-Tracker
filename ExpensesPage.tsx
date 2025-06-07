import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageContainer from '../components/Layout/PageContainer';
import ExpensesList from '../components/Expenses/ExpensesList';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import CategoriesList from '../components/Categories/CategoriesList';

const ExpensesPage: React.FC = () => {
  return (
    <PageContainer>
      <Routes>
        <Route path="/" element={
          <div className="pb-6">
            <ExpensesList />
            <div className="mt-8">
              <CategoriesList />
            </div>
          </div>
        } />
        <Route path="/add" element={<ExpenseForm mode="add" />} />
        <Route path="/edit/:id" element={<ExpenseForm mode="edit" />} />
        <Route path="*" element={<Navigate to="/expenses\" replace />} />
      </Routes>
    </PageContainer>
  );
};

export default ExpensesPage;