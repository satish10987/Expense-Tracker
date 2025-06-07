import React from 'react';
import PageContainer from '../components/Layout/PageContainer';
import AppSettings from '../components/Settings/AppSettings';

const SettingsPage: React.FC = () => {
  return (
    <PageContainer>
      <AppSettings />
    </PageContainer>
  );
};

export default SettingsPage;