import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface MarketplaceFilters {
  search: string;
  category: string;
  jobType: 'all' | 'full-time' | 'part-time' | 'gig';
  sortBy: 'date' | 'relevance';
}

interface MarketplaceContextType {
  filters: MarketplaceFilters;
  setFilters: (filters: MarketplaceFilters) => void;
}

const defaultFilters: MarketplaceFilters = {
  search: '',
  category: '',
  jobType: 'all',
  sortBy: 'date',
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<MarketplaceFilters>(defaultFilters);

  return (
    <MarketplaceContext.Provider value={{ filters, setFilters }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}