
import React from 'react';
import RoutesComponent from './routes';
import HelmetProvider from './components/HelmetProvider';
import { ThemeProvider } from './components/ThemeProvider';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="genius-theme">
      <HelmetProvider>
        <RoutesComponent />
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default App;
