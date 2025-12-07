/**
 * Regularization Preview Page
 * L1/L2 regularization teaser
 */

import { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useTheme } from '../context/ThemeContext';
import {
    calculateMSE,
    ridgeRegularization,
    lassoRegularization,
    formatNumber
} from '../utils/regressionMath';
import { Shield, Scale, Minimize2, AlertCircle } from 'lucide-react';
import './Regularization.css';

const Regularization = () => {
    const { isDark } = useTheme();
    const [lambda, setLambda] = useState(0.5);
    const [weight, setWeight] = useState(2);

    // Sample base cost
    const baseCost = 5;

    // Calculate regularized costs
    const l2Cost = ridgeRegularization(baseCost, weight, lambda);
    const l1Cost = lassoRegularization(baseCost, weight, lambda);

    // Generate cost curves
    const costCurves = useMemo(() => {
        const weights = [];
        const mseOnly = [];
        const ridge = [];
        const lasso = [];

        for (let w = -3; w <= 5; w += 0.1) {
            weights.push(w);
            const base = baseCost + (w - 2) ** 2; // Simulated MSE curve centered at w=2
            mseOnly.push(base);
            ridge.push(base + lambda * (w ** 2));
            lasso.push(base + lambda * Math.abs(w));
        }

        return { weights, mseOnly, ridge, lasso };
    }, [lambda]);

    const colors = {
        bg: isDark ? '#1e1e32' : '#ffffff',
        grid: isDark ? '#2d2d44' : '#e5e7eb',
        text: isDark ? '#cbd5e1' : '#4a4a68',
        mse: '#6366f1',
        ridge: '#10b981',
        lasso: '#f59e0b',
    };

    return (
        <div className="page regularization-page">
            <header className="page-header">
                <h1 className="page-title">Regularization Preview</h1>
                <p className="page-description">
                    A sneak peek at regularization — techniques to prevent overfitting
                    by penalizing large weights. Essential for robust models.
                </p>
                <span className="badge badge-warning">Advanced Topic Preview</span>
            </header>

            {/* Why Regularization */}
            <section className="section">
                <h2 className="section-title">
                    <Shield size={24} />
                    Why Regularization?
                </h2>
                <div className="section-content">
                    <div className="problem-solution">
                        <div className="problem">
                            <h4>🎯 The Problem: Overfitting</h4>
                            <p>
                                Complex models can "memorize" training data instead of learning
                                general patterns. Large weights often indicate overfitting.
                            </p>
                        </div>
                        <div className="solution">
                            <h4>💡 The Solution: Penalize Complexity</h4>
                            <p>
                                Add a penalty term to the cost function that discourages
                                large weights, keeping the model simpler and more generalizable.
                            </p>
                        </div>
                    </div>

                    <div className="regularized-cost">
                        <span className="formula-label">Regularized Cost Function</span>
                        <div className="formula-display">
                            J(θ) = MSE + λ × Penalty(θ)
                        </div>
                        <div className="lambda-note">
                            <strong>λ (lambda)</strong> controls regularization strength.
                            Higher λ = simpler model, more bias, less variance.
                        </div>
                    </div>
                </div>
            </section>

            {/* L1 vs L2 */}
            <section className="section">
                <h2 className="section-title">
                    <Scale size={24} />
                    L1 vs L2 Regularization
                </h2>

                <div className="regularization-types">
                    <div className="type-card ridge">
                        <div className="type-header">
                            <h3>L2 Regularization (Ridge)</h3>
                            <span className="badge badge-success">Most Common</span>
                        </div>
                        <div className="type-formula">
                            Penalty = λ × Σθ²
                        </div>
                        <ul>
                            <li>Shrinks weights toward zero (but rarely to exactly zero)</li>
                            <li>Smooth penalty — differentiable everywhere</li>
                            <li>Good when all features are somewhat relevant</li>
                            <li>Helps with multicollinearity</li>
                        </ul>
                    </div>

                    <div className="type-card lasso">
                        <div className="type-header">
                            <h3>L1 Regularization (Lasso)</h3>
                            <span className="badge badge-warning">Feature Selection</span>
                        </div>
                        <div className="type-formula">
                            Penalty = λ × Σ|θ|
                        </div>
                        <ul>
                            <li>Can shrink weights exactly to zero</li>
                            <li>Effectively performs feature selection</li>
                            <li>Sparse solutions — some features ignored completely</li>
                            <li>Good when few features are truly important</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Interactive Demo */}
            <section className="section">
                <h2 className="section-title">
                    <Minimize2 size={24} />
                    Interactive Demo
                </h2>

                <div className="reg-demo">
                    <div className="demo-controls">
                        <div className="slider-container">
                            <div className="slider-header">
                                <span className="slider-label">λ (Regularization Strength)</span>
                                <span className="slider-value">{formatNumber(lambda, 2)}</span>
                            </div>
                            <input
                                type="range"
                                className="slider"
                                min="0"
                                max="2"
                                step="0.05"
                                value={lambda}
                                onChange={(e) => setLambda(parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="cost-comparison">
                            <div className="cost-item">
                                <span className="cost-label">MSE Only</span>
                                <span className="cost-value mse">{formatNumber(baseCost, 2)}</span>
                            </div>
                            <div className="cost-item">
                                <span className="cost-label">Ridge (L2)</span>
                                <span className="cost-value ridge">{formatNumber(l2Cost, 2)}</span>
                                <span className="penalty">+{formatNumber(l2Cost - baseCost, 2)}</span>
                            </div>
                            <div className="cost-item">
                                <span className="cost-label">Lasso (L1)</span>
                                <span className="cost-value lasso">{formatNumber(l1Cost, 2)}</span>
                                <span className="penalty">+{formatNumber(l1Cost - baseCost, 2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="demo-plot">
                        <Plot
                            data={[
                                {
                                    x: costCurves.weights,
                                    y: costCurves.mseOnly,
                                    type: 'scatter',
                                    mode: 'lines',
                                    name: 'MSE Only',
                                    line: { color: colors.mse, width: 3 },
                                },
                                {
                                    x: costCurves.weights,
                                    y: costCurves.ridge,
                                    type: 'scatter',
                                    mode: 'lines',
                                    name: 'Ridge (L2)',
                                    line: { color: colors.ridge, width: 3 },
                                },
                                {
                                    x: costCurves.weights,
                                    y: costCurves.lasso,
                                    type: 'scatter',
                                    mode: 'lines',
                                    name: 'Lasso (L1)',
                                    line: { color: colors.lasso, width: 3 },
                                },
                            ]}
                            layout={{
                                autosize: true,
                                margin: { l: 60, r: 30, t: 30, b: 50 },
                                paper_bgcolor: colors.bg,
                                plot_bgcolor: colors.bg,
                                font: { color: colors.text },
                                xaxis: {
                                    title: 'Weight (θ)',
                                    gridcolor: colors.grid,
                                    zeroline: true,
                                    zerolinecolor: colors.text,
                                },
                                yaxis: {
                                    title: 'Cost',
                                    gridcolor: colors.grid
                                },
                                legend: { x: 0.02, y: 0.98 },
                            }}
                            config={{ displayModeBar: false, responsive: true }}
                            style={{ width: '100%', height: '350px' }}
                            useResizeHandler={true}
                        />
                    </div>
                </div>
            </section>

            {/* Key Differences */}
            <section className="section">
                <h2 className="section-title">Key Differences</h2>
                <div className="differences-table">
                    <div className="diff-header">
                        <span>Aspect</span>
                        <span>Ridge (L2)</span>
                        <span>Lasso (L1)</span>
                    </div>
                    <div className="diff-row">
                        <span>Penalty</span>
                        <span>Sum of squared weights</span>
                        <span>Sum of absolute weights</span>
                    </div>
                    <div className="diff-row">
                        <span>Weight Shrinkage</span>
                        <span>Toward zero, not to zero</span>
                        <span>Exactly to zero possible</span>
                    </div>
                    <div className="diff-row">
                        <span>Feature Selection</span>
                        <span>No (all features kept)</span>
                        <span>Yes (some features removed)</span>
                    </div>
                    <div className="diff-row">
                        <span>Solution</span>
                        <span>Unique</span>
                        <span>May not be unique</span>
                    </div>
                    <div className="diff-row">
                        <span>Best For</span>
                        <span>Correlated features</span>
                        <span>Feature selection</span>
                    </div>
                </div>
            </section>

            {/* Coming Soon */}
            <section className="section">
                <div className="coming-soon">
                    <AlertCircle size={24} />
                    <div>
                        <h3>More Coming in Advanced Topics</h3>
                        <p>
                            This is a preview. Full coverage of regularization, including
                            Elastic Net (L1+L2), cross-validation for λ selection, and
                            regularization in neural networks, will be covered in advanced modules.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Regularization;
