import React from 'react';
import PageContainer from '../components/Layout/PageContainer';
import ExpenseSummary from '../components/Dashboard/ExpenseSummary';
import CategoryBreakdown from '../components/Dashboard/CategoryBreakdown';
import RecentExpenses from '../components/Dashboard/RecentExpenses';

const Dashboard: React.FC = () => {
  return (
    <PageContainer>
      <div className="pb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Dashboard
        </h1>
        
        <ExpenseSummary />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CategoryBreakdown />
          </div>
          <div className="lg:col-span-1">
            <RecentExpenses />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;