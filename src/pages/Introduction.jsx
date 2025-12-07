/**
 * Introduction Page
 * Problem Definition + Basics of Linear Regression
 */

import { Link } from 'react-router-dom';
import { BookOpen, Target, TrendingUp, Layers, ArrowRight } from 'lucide-react';
import './Introduction.css';

const Introduction = () => {
    return (
        <div className="page intro-page">
            <header className="page-header">
                <h1 className="page-title">Linear Regression</h1>
                <p className="page-description">
                    The foundation of predictive modeling — understand how machines learn
                    to predict continuous values from data.
                </p>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-visual">
                    <div className="hero-graph">
                        <svg viewBox="0 0 400 300" className="graph-svg">
                            {/* Grid */}
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border-light)" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />

                            {/* Axes */}
                            <line x1="50" y1="250" x2="380" y2="250" stroke="var(--text-muted)" strokeWidth="2" />
                            <line x1="50" y1="250" x2="50" y2="20" stroke="var(--text-muted)" strokeWidth="2" />

                            {/* Data Points */}
                            <circle cx="80" cy="220" r="8" fill="var(--accent-primary)" opacity="0.8" />
                            <circle cx="120" cy="190" r="8" fill="var(--accent-primary)" opacity="0.8" />
                            <circle cx="150" cy="180" r="8" fill="var(--accent-primary)" opacity="0.8" />
                            <circle cx="180" cy="160" r="8" fill="var(--accent-primary)" opacity="0.8" />
                            <circle cx="220" cy="140" r="8" fill="var(--accent-primary)" opacity="0.8" />
                            <circle cx="260" cy="120" r="8" fill="var(--accent-primary)" opacity="0.8" />
                            <circle cx="290" cy="100" r="8" fill="var(--accent-primary)" opacity="0.8" />
                            <circle cx="330" cy="70" r="8" fill="var(--accent-primary)" opacity="0.8" />
                            <circle cx="360" cy="50" r="8" fill="var(--accent-primary)" opacity="0.8" />

                            {/* Regression Line */}
                            <line x1="60" y1="230" x2="380" y2="40" stroke="var(--accent-secondary)" strokeWidth="3" strokeDasharray="8,4" />

                            {/* Labels */}
                            <text x="390" y="255" fill="var(--text-secondary)" fontSize="14">X</text>
                            <text x="40" y="15" fill="var(--text-secondary)" fontSize="14">Y</text>
                        </svg>
                    </div>
                </div>

                <div className="hero-content">
                    <div className="hero-equation">
                        <span className="equation-label">The Model</span>
                        <div className="equation-display">
                            y = mx + b
                        </div>
                        <div className="equation-parts">
                            <span><strong>y</strong> = predicted value</span>
                            <span><strong>m</strong> = slope (weight)</span>
                            <span><strong>x</strong> = input feature</span>
                            <span><strong>b</strong> = intercept (bias)</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* What is Linear Regression */}
            <section className="section">
                <h2 className="section-title">
                    <BookOpen size={24} />
                    What is Linear Regression?
                </h2>
                <div className="section-content">
                    <p>
                        Linear Regression is a <strong>supervised learning algorithm</strong> that models
                        the relationship between a dependent variable (target) and one or more independent
                        variables (features) using a linear equation.
                    </p>
                    <p>
                        It's used to predict <strong>continuous values</strong> — like house prices,
                        temperatures, sales figures, or any numerical quantity that can take any value
                        within a range.
                    </p>

                    <div className="key-points">
                        <div className="key-point">
                            <div className="point-icon">📈</div>
                            <div className="point-content">
                                <h4>Prediction</h4>
                                <p>Forecast future values based on historical patterns</p>
                            </div>
                        </div>
                        <div className="key-point">
                            <div className="point-icon">🔗</div>
                            <div className="point-content">
                                <h4>Relationship</h4>
                                <p>Quantify the relationship between variables</p>
                            </div>
                        </div>
                        <div className="key-point">
                            <div className="point-icon">📊</div>
                            <div className="point-content">
                                <h4>Interpretability</h4>
                                <p>Coefficients directly show feature importance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Real World Examples */}
            <section className="section">
                <h2 className="section-title">
                    <Target size={24} />
                    Real-World Applications
                </h2>
                <div className="examples-grid">
                    <div className="example-card">
                        <div className="example-emoji">🏠</div>
                        <h4>House Prices</h4>
                        <p>Predict price based on square footage, bedrooms, location</p>
                    </div>
                    <div className="example-card">
                        <div className="example-emoji">📊</div>
                        <h4>Sales Forecasting</h4>
                        <p>Estimate future sales from advertising spend</p>
                    </div>
                    <div className="example-card">
                        <div className="example-emoji">🌡️</div>
                        <h4>Temperature</h4>
                        <p>Predict temperature based on time of year, location</p>
                    </div>
                    <div className="example-card">
                        <div className="example-emoji">⚕️</div>
                        <h4>Medical Dosage</h4>
                        <p>Calculate medication dose based on patient weight</p>
                    </div>
                    <div className="example-card">
                        <div className="example-emoji">🚗</div>
                        <h4>Car Mileage</h4>
                        <p>Estimate fuel efficiency from engine specifications</p>
                    </div>
                    <div className="example-card">
                        <div className="example-emoji">📈</div>
                        <h4>Stock Analysis</h4>
                        <p>Analyze trends and make price predictions</p>
                    </div>
                </div>
            </section>

            {/* Types */}
            <section className="section">
                <h2 className="section-title">
                    <Layers size={24} />
                    Types of Linear Regression
                </h2>
                <div className="types-grid">
                    <div className="type-card">
                        <div className="type-header">
                            <h3>Simple Linear Regression</h3>
                            <span className="badge badge-primary">1 Feature</span>
                        </div>
                        <div className="type-formula">y = mx + b</div>
                        <p>
                            Models the relationship between a single independent variable (X)
                            and a dependent variable (Y).
                        </p>
                        <ul className="type-list">
                            <li>One input feature</li>
                            <li>Two parameters to learn (m, b)</li>
                            <li>2D visualization possible</li>
                        </ul>
                    </div>

                    <div className="type-card">
                        <div className="type-header">
                            <h3>Multiple Linear Regression</h3>
                            <span className="badge badge-secondary">n Features</span>
                        </div>
                        <div className="type-formula">y = w₁x₁ + w₂x₂ + ... + wₙxₙ + b</div>
                        <p>
                            Extends to multiple independent variables, modeling complex
                            relationships with many inputs.
                        </p>
                        <ul className="type-list">
                            <li>Multiple input features</li>
                            <li>n+1 parameters to learn</li>
                            <li>Hyperplane in n-dimensional space</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Learning Path */}
            <section className="section">
                <h2 className="section-title">
                    <TrendingUp size={24} />
                    Learning Path
                </h2>
                <div className="learning-path">
                    <Link to="/math" className="path-step">
                        <span className="step-number">1</span>
                        <div className="step-content">
                            <h4>Mathematical Formulation</h4>
                            <p>Understand the math behind the model</p>
                        </div>
                        <ArrowRight size={20} />
                    </Link>

                    <Link to="/cost" className="path-step">
                        <span className="step-number">2</span>
                        <div className="step-content">
                            <h4>Cost Functions</h4>
                            <p>Learn how we measure error</p>
                        </div>
                        <ArrowRight size={20} />
                    </Link>

                    <Link to="/optimization" className="path-step">
                        <span className="step-number">3</span>
                        <div className="step-content">
                            <h4>Optimization</h4>
                            <p>How the model learns from data</p>
                        </div>
                        <ArrowRight size={20} />
                    </Link>

                    <Link to="/visualizer" className="path-step">
                        <span className="step-number">4</span>
                        <div className="step-content">
                            <h4>Interactive Visualizer</h4>
                            <p>See it all in action!</p>
                        </div>
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Introduction;
