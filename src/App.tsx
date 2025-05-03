
import React from 'react';
import RoutesComponent from './routes';
import HelmetProvider from './components/HelmetProvider';
import { ThemeProvider } from './components/ThemeProvider';
import GlobalNavigation from './components/GlobalNavigation/GlobalNavigation';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="genius-theme">
      <HelmetProvider>
        <div className="flex flex-col min-h-screen">
          <GlobalNavigation />
          <div className="pt-16">
            <RoutesComponent />
          </div>
        </div>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default App;
