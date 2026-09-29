import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SharedProvider, LoadingProvider, GlobalLoadingOverlay } from '@template/shared';
import MainPrompt from './pages/MainPrompt';
import InitialDataEntryList from './pages/InitialDataEntryList';
import InitialDataEntry from './pages/InitialDataEntry';
import './global.css';

interface ModuleProps {
  basePath?: string;
  subRoute?: string;
}

type ScreenMode = 'main' | 'list' | 'form';

const ModuleContent: React.FC<ModuleProps> = ({
  basePath = '/initial-data-entry',
  subRoute,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine initial screen from path
  const getScreenFromPath = (path: string): ScreenMode => {
    const rel = path.replace(basePath, '').replace(/^\//, '');
    if (rel.startsWith('list')) return 'list';
    if (rel.startsWith('form') || rel.startsWith('ide')) return 'form';
    return 'main';
  };

  const [screen, setScreen] = useState<ScreenMode>(() => getScreenFromPath(currentPath));
  const [selectedProspect, setSelectedProspect] = useState<any>(null);

  useEffect(() => {
    const s = getScreenFromPath(currentPath);
    setScreen(s);
    if (s === 'form' && !selectedProspect) {
      setSelectedProspect({ isNew: true });
    }
  }, [currentPath]);

  const handleNavigate = (nextScreen: ScreenMode, data?: any) => {
    setSelectedProspect(data !== undefined ? data : null);
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (screen === 'list') {
    return <InitialDataEntryList onNavigate={handleNavigate} />;
  }

  if (screen === 'form') {
    return (
      <InitialDataEntry
        onNavigate={handleNavigate}
        selectedProspect={selectedProspect}
      />
    );
  }

  // Default: Main Prompt (Gambar 1)
  return <MainPrompt onNavigate={handleNavigate} />;
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
