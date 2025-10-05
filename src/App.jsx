import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { forceChakraDarkTheme } from './utils/utils';
import DotGridDemo from './demo/Backgrounds/DotGridDemo';

function AppContent() {
  return (
    <>
      <DotGridDemo />
    </>
  );
}

export default function App() {
  useEffect(() => {
    forceChakraDarkTheme();
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}
