/**
 * Layout Component
 * Main layout wrapper with navbar and content area
 */

import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import './Layout.css';

const Layout = () => {
    return (
        <div className="layout">
            <Navbar />
            <main className="main-content">
                <div className="content-container">
                    <Outlet />
                </div>
            </main>
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-credits">
                        <p className="footer-line">
                            <span className="footer-label">Ideation & Creativity</span>
                            <span className="footer-divider">by</span>
                            <span className="footer-name">CodingYodha</span>
                        </p>
                        <p className="footer-separator">|</p>
                        <p className="footer-line">
                            <span className="footer-label">Vibe Coded with</span>
                            <span className="footer-name">Google Antigravity</span>
                        </p>
                    </div>
                    <Link to="/about" className="footer-about-link">About</Link>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
