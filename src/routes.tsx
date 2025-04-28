
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Index from './pages/Index';

const RoutesComponent = () => (
  <BrowserRouter>
    <Routes>
      {/* Main Routes */}
      <Route path="/" element={<Index />} />
      
      {/* 404 route - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default RoutesComponent;
