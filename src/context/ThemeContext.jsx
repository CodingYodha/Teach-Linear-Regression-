/**
 * Theme Context Provider
 * Manages dark/light mode toggle across the application
 */

import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const ThemeContext = createContext();

/**
 * Custom hook to access theme context
 * @returns {Object} theme state and toggle function
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

/**
 * Theme Provider Component
 * Wraps the app and provides theme state globally
 */
export const ThemeProvider = ({ children }) => {
    // Initialize theme from localStorage or system preference
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;

        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Toggle between light and dark
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const value = {
        theme,
        isDark: theme === 'dark',
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
