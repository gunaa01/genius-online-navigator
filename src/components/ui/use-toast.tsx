// Simplified toast component for the AI Insights Dashboard
import { useState, useEffect } from 'react';

interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

// Simple toast function that can be imported and used anywhere
export const toast = (props: ToastProps) => {
  // In a real implementation, this would use a context provider
  // For now, we'll just log to console
  console.log(`Toast: ${props.title} - ${props.description} (${props.variant || 'default'})`);
  
  // Create a DOM element for the toast (simplified implementation)
  const toastElement = document.createElement('div');
  toastElement.className = `fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${
    props.variant === 'destructive' ? 'bg-red-100 border-red-400' : 'bg-green-100 border-green-400'
  } border`;
  
  const titleElement = document.createElement('h3');
  titleElement.className = 'font-medium';
  titleElement.textContent = props.title;
  
  const descElement = document.createElement('p');
  descElement.className = 'text-sm';
  descElement.textContent = props.description;
  
  toastElement.appendChild(titleElement);
  toastElement.appendChild(descElement);
  document.body.appendChild(toastElement);
  
  // Remove after duration
  setTimeout(() => {
    if (document.body.contains(toastElement)) {
      document.body.removeChild(toastElement);
    }
  }, props.duration || 3000);
  
  return {
    id: Date.now().toString(),
    dismiss: () => {
      if (document.body.contains(toastElement)) {
        document.body.removeChild(toastElement);
      }
    }
  };
};
