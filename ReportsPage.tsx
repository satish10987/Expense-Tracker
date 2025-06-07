import React from 'react';
import PageContainer from '../components/Layout/PageContainer';
import MonthlyChart from '../components/Reports/MonthlyChart';
import YearlyChart from '../components/Reports/YearlyChart';

const ReportsPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="pb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Reports & Analytics
        </h1>
        
        <MonthlyChart />
        <YearlyChart />
      </div>
    </PageContainer>
  );
};

export default ReportsPage;