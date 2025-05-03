
import React from 'react';
import { Link } from 'react-router-dom';
import SocialMediaAutomation from '../components/SocialMediaAutomation';
import ErrorBoundary from '../components/ErrorBoundary';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

/**
 * SocialMedia page component that integrates the SocialMediaAutomation component
 * This serves as a container page for the social media automation functionality
 */
const SocialMedia: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Social Media Automation</h1>
          <Link to="/social-dashboard">
            <Button variant="outline">
              View Enhanced Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <SocialMediaAutomation />
      </div>
    </ErrorBoundary>
  );
};

export default SocialMedia;
