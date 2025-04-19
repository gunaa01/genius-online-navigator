// src/components/Menu.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between">
                <div className="flex space-x-4">
                    <Link to="/" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Home</Link>
                    <Link to="/analytics" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Analytics</Link>
                    <Link to="/reports" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Reports</Link>
                    <Link to="/ads" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Ad Campaigns</Link>
                    <Link to="/social" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Social Media</Link>
                    <Link to="/content" className="text-white hover:bg-gray-700 px-3 py-2 rounded">AI Content</Link>
                    <Link to="/community" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Community</Link>
                    <Link to="/integrations" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Integrations</Link>
                    <Link to="/team" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Team</Link>
                    <Link to="/settings" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Settings</Link>
                </div>
                <div className="flex items-center">
                    <Link to="/auth" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Get Started</Link>
                </div>
            </div>
        </nav>
    );
};

export default Menu;