import React, { useState } from 'react';
import { SharedProvider, LoadingProvider, GlobalLoadingOverlay } from '@template/shared';
import DataEntryList from './pages/DataEntryList';
import DataEntryForm from './pages/DataEntryForm';
import { type DataEntryRecord } from './services/dataEntryData';
import './global.css';

const App: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<DataEntryRecord | null>(null);

  return (
    <SharedProvider>
      <LoadingProvider>
        {selectedApp ? (
          <DataEntryForm
            application={selectedApp}
            onBackToList={() => setSelectedApp(null)}
            onApplicationUpdated={(updated) => setSelectedApp(updated)}
          />
        ) : (
          <DataEntryList onSelectApplication={(app) => setSelectedApp(app)} />
        )}
        <GlobalLoadingOverlay />
      </LoadingProvider>
    </SharedProvider>
  );
};

export default App;
