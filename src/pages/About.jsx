/**
 * About Page
 * Creator information and project details
 */

import { User, Code, Sparkles, Github, Linkedin, Globe } from 'lucide-react';
import './About.css';

const About = () => {
    return (
        <div className="page about-page">
            <header className="page-header">
                <h1 className="page-title">About</h1>
                <p className="page-description">
                    The mind behind this interactive learning platform.
                </p>
            </header>

            {/* Creator Card */}
            <section className="creator-section">
                <div className="creator-card">
                    <div className="creator-avatar">
                        <img src="/profile.jpg" alt="Shivaprasad Gowda" className="avatar-image" />
                    </div>

                    <div className="creator-info">
                        <h2 className="creator-name">Shivaprasad Gowda</h2>
                        <span className="creator-handle">CodingYodha</span>

                        <p className="creator-bio">
                            AIML undergrad focused on building neural networks and exploring the
                            fast-paced, ever-evolving world of Artificial Intelligence.
                        </p>

                        <div className="creator-tags">
                            <span className="tag">Machine Learning</span>
                            <span className="tag">Deep Learning</span>
                            <span className="tag">Data Science</span>
                            <span className="tag">Real world ML</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Info */}
            <section className="section">
                <h2 className="section-title">
                    <Code size={24} />
                    About This Project
                </h2>
                <div className="section-content">
                    <div className="project-info">
                        <div className="info-block">
                            <h4>The Vision</h4>
                            <p>
                                Linear regression is often the first algorithm taught in machine learning,
                                yet many learners struggle to connect the math with what is actually happening.
                                This platform makes those concepts tangible through real-time interaction.
                            </p>
                        </div>

                        <div className="info-block">
                            <h4>Built For</h4>
                            <p>
                                AI Bootcamp sessions where instructors can demonstrate concepts live.
                                Every visualization updates instantly, making it perfect for classroom
                                teaching and self-paced learning alike.
                            </p>
                        </div>

                        <div className="info-block">
                            <h4>Design Philosophy</h4>
                            <p>
                                Clean, minimal, and focused. No unnecessary animations or visual clutter.
                                Every element serves a teaching purpose. The interface gets out of the way
                                so learners can focus on the concepts.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="section">
                <h2 className="section-title">
                    <Sparkles size={24} />
                    Technology
                </h2>
                <div className="tech-grid">
                    <div className="tech-item">
                        <span className="tech-name">React</span>
                        <span className="tech-desc">UI Framework</span>
                    </div>
                    <div className="tech-item">
                        <span className="tech-name">Vite</span>
                        <span className="tech-desc">Build Tool</span>
                    </div>
                    <div className="tech-item">
                        <span className="tech-name">Plotly.js</span>
                        <span className="tech-desc">Visualizations</span>
                    </div>
                    <div className="tech-item">
                        <span className="tech-name">React Router</span>
                        <span className="tech-desc">Navigation</span>
                    </div>
                </div>
            </section>

            {/* Credits */}
            <section className="section">
                <div className="credits-box">
                    <p className="credits-text">
                        <span className="credits-label">Ideation and Creativity</span>
                        <span className="credits-value">CodingYodha</span>
                    </p>
                    <p className="credits-divider">crafted with</p>
                    <p className="credits-text">
                        <span className="credits-label">Vibe Coded</span>
                        <span className="credits-value">Google Antigravity</span>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default About;
