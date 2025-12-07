/**
 * Optimization Page
 * Gradient Descent and optimization methods
 */

import GradientDescentSimulator from '../components/gradient/GradientDescent';
import { Zap, TrendingDown, Settings, AlertCircle } from 'lucide-react';
import './Optimization.css';

const Optimization = () => {
    return (
        <div className="page optimization-page">
            <header className="page-header">
                <h1 className="page-title">Optimization</h1>
                <p className="page-description">
                    How does the model "learn"? Through optimization algorithms that iteratively
                    adjust parameters to minimize the cost function.
                </p>
            </header>

            {/* What is Optimization */}
            <section className="section">
                <h2 className="section-title">
                    <Zap size={24} />
                    The Optimization Problem
                </h2>
                <div className="section-content">
                    <p>
                        We have a cost function J(θ) that measures prediction error.
                        <strong>Optimization</strong> is the process of finding the parameters θ
                        that minimize J(θ).
                    </p>

                    <div className="optimization-goal">
                        <span className="goal-label">Goal</span>
                        <div className="goal-formula">
                            θ* = arg min<sub>θ</sub> J(θ)
                        </div>
                        <span className="goal-desc">Find θ that minimizes the cost function</span>
                    </div>
                </div>
            </section>

            {/* Gradient Descent */}
            <section className="section">
                <h2 className="section-title">
                    <TrendingDown size={24} />
                    Gradient Descent
                </h2>
                <div className="section-content">
                    <p>
                        <strong>Gradient Descent</strong> is the workhorse of machine learning optimization.
                        It iteratively moves in the direction of steepest descent (negative gradient)
                        to find the minimum.
                    </p>

                    <div className="gd-concept">
                        <div className="concept-visual">
                            <svg viewBox="0 0 300 200" className="gd-svg">
                                {/* Cost curve */}
                                <path
                                    d="M 20 180 Q 150 20 280 180"
                                    fill="none"
                                    stroke="var(--accent-secondary)"
                                    strokeWidth="3"
                                />

                                {/* Steps */}
                                <circle cx="50" cy="150" r="6" fill="var(--error)" />
                                <circle cx="80" cy="100" r="6" fill="var(--warning)" />
                                <circle cx="120" cy="60" r="6" fill="var(--warning)" />
                                <circle cx="150" cy="40" r="6" fill="var(--success)" />

                                {/* Arrows */}
                                <line x1="50" y1="150" x2="75" y2="105" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrow)" />
                                <line x1="80" y1="100" x2="115" y2="65" stroke="var(--text-muted)" strokeWidth="2" />
                                <line x1="120" y1="60" x2="145" y2="45" stroke="var(--text-muted)" strokeWidth="2" />

                                {/* Labels */}
                                <text x="150" y="190" fill="var(--text-secondary)" fontSize="12" textAnchor="middle">θ</text>
                                <text x="10" y="100" fill="var(--text-secondary)" fontSize="12">J(θ)</text>
                            </svg>
                        </div>

                        <div className="concept-explanation">
                            <h4>The Algorithm</h4>
                            <ol className="algorithm-steps">
                                <li>
                                    <span className="step-num">1</span>
                                    <span>Start with initial guess for θ</span>
                                </li>
                                <li>
                                    <span className="step-num">2</span>
                                    <span>Calculate gradient ∇J(θ)</span>
                                </li>
                                <li>
                                    <span className="step-num">3</span>
                                    <span>Update: θ = θ - α × ∇J(θ)</span>
                                </li>
                                <li>
                                    <span className="step-num">4</span>
                                    <span>Repeat until convergence</span>
                                </li>
                            </ol>
                        </div>
                    </div>

                    <div className="update-rule">
                        <span className="rule-label">Update Rule</span>
                        <div className="rule-formula">
                            θ<sub>j</sub> := θ<sub>j</sub> - α × (∂J/∂θ<sub>j</sub>)
                        </div>
                        <div className="rule-parts">
                            <span><strong>α</strong> = learning rate (step size)</span>
                            <span><strong>∂J/∂θ</strong> = partial derivative (gradient)</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Learning Rate */}
            <section className="section">
                <h2 className="section-title">
                    <Settings size={24} />
                    The Learning Rate (α)
                </h2>
                <div className="section-content">
                    <p>
                        The learning rate controls how big of a step we take in each iteration.
                        It's one of the most important hyperparameters to tune.
                    </p>

                    <div className="lr-scenarios">
                        <div className="lr-card too-small">
                            <div className="lr-header">
                                <span className="lr-icon">🐌</span>
                                <h4>Too Small</h4>
                            </div>
                            <p>Very slow convergence. May take forever to reach minimum.</p>
                            <div className="lr-visual">
                                <div className="step small"></div>
                                <div className="step small"></div>
                                <div className="step small"></div>
                                <div className="step small"></div>
                            </div>
                        </div>

                        <div className="lr-card just-right">
                            <div className="lr-header">
                                <span className="lr-icon">✅</span>
                                <h4>Just Right</h4>
                            </div>
                            <p>Steady progress toward minimum. Good balance.</p>
                            <div className="lr-visual">
                                <div className="step medium"></div>
                                <div className="step medium"></div>
                                <div className="step medium"></div>
                            </div>
                        </div>

                        <div className="lr-card too-large">
                            <div className="lr-header">
                                <span className="lr-icon">💥</span>
                                <h4>Too Large</h4>
                            </div>
                            <p>Overshoots minimum. May diverge completely!</p>
                            <div className="lr-visual">
                                <div className="step large"></div>
                                <div className="step large diverge"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gradient for Linear Regression */}
            <section className="section">
                <h2 className="section-title">Gradient for Linear Regression</h2>
                <div className="section-content">
                    <div className="gradient-derivation">
                        <div className="deriv-step">
                            <span className="deriv-label">Cost Function (MSE)</span>
                            <div className="deriv-formula">
                                J(θ) = (1/2m) × Σ(h<sub>θ</sub>(x<sup>(i)</sup>) - y<sup>(i)</sup>)²
                            </div>
                        </div>

                        <div className="deriv-step">
                            <span className="deriv-label">Gradient w.r.t. θ₀ (bias)</span>
                            <div className="deriv-formula">
                                ∂J/∂θ₀ = (1/m) × Σ(h<sub>θ</sub>(x<sup>(i)</sup>) - y<sup>(i)</sup>)
                            </div>
                        </div>

                        <div className="deriv-step">
                            <span className="deriv-label">Gradient w.r.t. θ₁ (weight)</span>
                            <div className="deriv-formula">
                                ∂J/∂θ₁ = (1/m) × Σ(h<sub>θ</sub>(x<sup>(i)</sup>) - y<sup>(i)</sup>) × x<sup>(i)</sup>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Variants */}
            <section className="section">
                <h2 className="section-title">Gradient Descent Variants</h2>
                <div className="variants-grid">
                    <div className="variant-card">
                        <h4>Batch GD</h4>
                        <p>Uses all training examples per update. Stable but slow for large datasets.</p>
                        <div className="variant-formula">θ = θ - α × (1/m)Σ∇J</div>
                    </div>

                    <div className="variant-card">
                        <h4>Stochastic GD</h4>
                        <p>Uses one random example per update. Fast but noisy updates.</p>
                        <div className="variant-formula">θ = θ - α × ∇J(x<sup>i</sup>)</div>
                    </div>

                    <div className="variant-card">
                        <h4>Mini-Batch GD</h4>
                        <p>Uses small batch (32-256) per update. Best of both worlds!</p>
                        <div className="variant-formula">θ = θ - α × (1/b)Σ∇J</div>
                    </div>
                </div>
            </section>

            {/* Interactive Simulator */}
            <section className="section">
                <h2 className="section-title">🎮 Interactive Gradient Descent Simulator</h2>
                <p className="section-description">
                    Watch gradient descent in action! Adjust the learning rate and see how it affects
                    convergence. Try a high learning rate to see divergence.
                </p>
                <GradientDescentSimulator />
            </section>

            {/* Tips */}
            <section className="section">
                <div className="tips-box">
                    <h3><AlertCircle size={20} /> Practical Tips</h3>
                    <ul>
                        <li>Start with a small learning rate (0.01 or 0.001)</li>
                        <li>Use learning rate decay for better convergence</li>
                        <li>Normalize/standardize features for faster convergence</li>
                        <li>Monitor the loss curve — it should decrease smoothly</li>
                        <li>If loss increases or oscillates, reduce learning rate</li>
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default Optimization;
