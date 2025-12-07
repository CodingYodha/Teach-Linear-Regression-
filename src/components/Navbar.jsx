/**
 * Navigation Component
 * Main navigation header with tabs and theme toggle
 */

import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, GraduationCap } from 'lucide-react';
import './Navbar.css';

// Navigation items configuration
const navItems = [
    { path: '/', label: 'Introduction' },
    { path: '/math', label: 'Math Formulation' },
    { path: '/cost', label: 'Cost Functions' },
    { path: '/optimization', label: 'Optimization' },
    { path: '/metrics', label: 'Metrics' },
    { path: '/visualizer', label: 'Visualizer' },
    { path: '/outliers', label: 'Outliers' },
    { path: '/gradient', label: 'Gradient Descent' },
    { path: '/multiple', label: 'Multiple Regression' },
    { path: '/normal-equation', label: 'Normal Equation' },
    { path: '/regularization', label: 'Regularization' },
];

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <div className="navbar-brand">
                    <GraduationCap size={28} className="brand-icon" />
                    <div className="brand-text">
                        <span className="brand-title">AI Bootcamp</span>
                        <span className="brand-subtitle">Linear Regression</span>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="navbar-nav">
                    <div className="nav-scroll">
                        {navItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* Theme Toggle */}
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </div>
        </header>
    );
};

export default Navbar;
