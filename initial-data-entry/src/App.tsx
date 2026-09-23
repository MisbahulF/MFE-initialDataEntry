import React, { useState } from 'react';
import MainPrompt from './pages/MainPrompt';
import InitialDataEntryList from './pages/InitialDataEntryList';
import InitialDataEntry from './pages/InitialDataEntry';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<'main' | 'list' | 'form'>('main');
  const [selectedProspect, setSelectedProspect] = useState<any>(null);

  const handleNavigate = (nextScreen: 'main' | 'list' | 'form', data?: any) => {
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

  return <MainPrompt onNavigate={handleNavigate} />;
};

export default App;
