// src/components/Menu.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth";
import { UserCircle } from "lucide-react";
import { useTheme } from "next-themes";

const menuItems = [
    { to: '/', label: 'Home' }, 
    { to: '/dashboard', label: 'Dashboard' }, 
    { to: '/analytics', label: 'Analytics' },
    { to: '/reports', label: 'Reports' },
    { to: '/ads', label: 'Ad Campaigns' },
    { to: '/social', label: 'Social Media' },
    { to: '/content', label: 'AI Content' },
    { to: '/community', label: 'Community' },
    { to: '/integrations', label: 'Integrations' },
    { to: '/team', label: 'Team' },
    { to: '/settings', label: 'Settings' },
];

const Menu: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const { user, loading } = useAuth();
    const { theme, setTheme } = useTheme();

    // Close menu when clicking outside (mobile)
    useEffect(() => {
        if (!menuOpen) return;
        const handleClick = (e: MouseEvent) => {
            const menu = document.getElementById('mobile-menu');
            if (menu && !menu.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [menuOpen]);

    return (
        <nav className={`bg-${theme === 'dark' ? 'gray-900' : 'white'} p-4 shadow-md fixed w-full z-30 top-0 left-0`}>
            <div className="container mx-auto flex justify-between items-center relative">
                {/* Brand/Logo */}
                <div className="text-primary font-bold text-xl tracking-wide flex items-center gap-2">
                  <span className="text-green-400">&#8765;</span> Genius
                </div>
                {/* Desktop Menu */}
                <div className="hidden md:flex md:flex-row md:space-x-4">
                    {menuItems.map(item => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`text-primary px-3 py-2 rounded transition-colors duration-200 ${location.pathname === item.to ? 'bg-muted font-semibold' : 'hover:bg-muted/60'}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
                {/* Right Side: Theme toggle, Get Started or Avatar */}
                <div className="flex items-center gap-4">
                  <button
                    className="p-2 rounded hover:bg-muted/50"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? (
                      <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.95 7.05l-.71-.71M6.34 6.34l-.71-.71" /></svg>
                    ) : (
                      <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
                    )}
                  </button>
                  {!loading && !user && (
                    <Link to="/auth">
                      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold transition-colors duration-200">Get Started</button>
                    </Link>
                  )}
                  {!loading && user && (
                    <Link to="/dashboard">
                      <UserCircle className="h-8 w-8 text-green-400" />
                    </Link>
                  )}
                </div>
                {/* Hamburger (mobile) */}
                <button
                    className="md:hidden text-primary hover:text-green-400 focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                {/* Mobile Sidebar Menu */}
                {menuOpen && (
                    <>
                        {/* Backdrop */}
                        <div className={`fixed inset-0 bg-${theme === 'dark' ? 'black' : 'white'} bg-opacity-40 z-40 transition-opacity duration-300`} onClick={() => setMenuOpen(false)}></div>
                        {/* Sidebar */}
                        <div id="mobile-menu" className={`fixed top-0 left-0 h-full w-64 bg-${theme === 'dark' ? 'gray-900' : 'white'} shadow-lg flex flex-col p-6 z-50 animate-slideIn`}>
                            <button
                                className="self-end mb-6 text-primary hover:text-green-400 focus:outline-none"
                                onClick={() => setMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            {menuItems.map(item => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`block text-primary px-3 py-2 rounded mb-1 transition-colors duration-200 ${location.pathname === item.to ? 'bg-muted font-semibold' : 'hover:bg-muted/60'}`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            {!loading && !user && (
                              <Link to="/auth">
                                <button className="block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold transition-colors duration-200 mt-4">Get Started</button>
                              </Link>
                            )}
                            {!loading && user && (
                              <Link to="/dashboard">
                                <UserCircle className="h-8 w-8 text-green-400" />
                              </Link>
                            )}
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Menu;