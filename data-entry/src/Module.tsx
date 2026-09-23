import React, { useState, useEffect } from 'react';
import { SharedProvider, LoadingProvider, GlobalLoadingOverlay } from '@template/shared';
import DataEntryList from './pages/DataEntryList';
import DataEntryForm from './pages/DataEntryForm';
import { dataEntryService, type DataEntryRecord } from './services/dataEntryData';
import './global.css';

interface ModuleProps {
  basePath?: string;
  subRoute?: string;
}

const ModuleContent: React.FC<ModuleProps> = () => {
  const [selectedApp, setSelectedApp] = useState<DataEntryRecord | null>(null);

  // Deteksi deep link jika URL membawa parameter ?appNo=... atau ?regno=...
  useEffect(() => {
    const checkDeepLink = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const targetId = params.get('appNo') || params.get('regno') || params.get('id');
        if (targetId) {
          const app = dataEntryService.getById(targetId);
          if (app) {
            setSelectedApp(app);
          }
        }
      } catch (e) {
        console.error('Failed to parse deep link in Data Entry Module:', e);
      }
    };

    checkDeepLink();
    window.addEventListener('popstate', checkDeepLink);
    return () => window.removeEventListener('popstate', checkDeepLink);
  }, []);

  if (selectedApp) {
    return (
      <DataEntryForm
        application={selectedApp}
        onBackToList={() => {
          setSelectedApp(null);
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('appNo');
            url.searchParams.delete('regno');
            url.searchParams.delete('id');
            window.history.pushState(null, '', url.pathname + (url.search ? url.search : ''));
          } catch {}
        }}
        onApplicationUpdated={(updated) => setSelectedApp(updated)}
      />
    );
  }

  return (
    <DataEntryList
      onSelectApplication={(app) => setSelectedApp(app)}
      onNavigateHome={() => {
        window.history.pushState(null, '', '/initial-data-entry');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }}
    />
  );
};

const Module: React.FC<ModuleProps> = (props) => {
  return (
    <SharedProvider>
      <LoadingProvider>
        <ModuleContent {...props} />
        <GlobalLoadingOverlay />
      </LoadingProvider>
    </SharedProvider>
  );
};

export default Module;