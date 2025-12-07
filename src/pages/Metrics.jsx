/**
 * Metrics Page
 * MSE, RMSE, MAE, R² Score with visual examples
 */

import { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useTheme } from '../context/ThemeContext';
import {
    calculateMSE,
    calculateRMSE,
    calculateMAE,
    calculateR2,
    calculateLinearRegression,
    formatNumber,
} from '../utils/regressionMath';
import { BarChart2, Target, TrendingUp, Award } from 'lucide-react';
import './Metrics.css';

const Metrics = () => {
    const { isDark } = useTheme();

    // Sample data for demonstration
    const [scenario, setScenario] = useState('good');

    const scenarios = {
        good: {
            name: 'Good Fit',
            points: [
                { x: 1, y: 2.1 }, { x: 2, y: 4.2 }, { x: 3, y: 5.9 },
                { x: 4, y: 8.1 }, { x: 5, y: 9.8 }, { x: 6, y: 12.2 },
                { x: 7, y: 14.1 }, { x: 8, y: 15.9 }, { x: 9, y: 18.2 }, { x: 10, y: 20.1 }
            ]
        },
        poor: {
            name: 'Poor Fit',
            points: [
                { x: 1, y: 5 }, { x: 2, y: 2 }, { x: 3, y: 8 },
                { x: 4, y: 3 }, { x: 5, y: 12 }, { x: 6, y: 4 },
                { x: 7, y: 15 }, { x: 8, y: 6 }, { x: 9, y: 10 }, { x: 10, y: 8 }
            ]
        },
        outliers: {
            name: 'With Outliers',
            points: [
                { x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 },
                { x: 4, y: 8 }, { x: 5, y: 25 }, { x: 6, y: 12 },
                { x: 7, y: 14 }, { x: 8, y: 16 }, { x: 9, y: 18 }, { x: 10, y: 20 }
            ]
        }
    };

    const currentData = scenarios[scenario];

    // Calculate regression and metrics
    const regression = useMemo(() => {
        return calculateLinearRegression(currentData.points);
    }, [currentData]);

    const metrics = useMemo(() => {
        const { slope, intercept } = regression;
        return {
            mse: calculateMSE(currentData.points, slope, intercept),
            rmse: calculateRMSE(currentData.points, slope, intercept),
            mae: calculateMAE(currentData.points, slope, intercept),
            r2: calculateR2(currentData.points, slope, intercept),
        };
    }, [currentData, regression]);

    // Plot colors
    const colors = {
        bg: isDark ? '#1e1e32' : '#ffffff',
        grid: isDark ? '#2d2d44' : '#e5e7eb',
        text: isDark ? '#cbd5e1' : '#4a4a68',
        point: '#6366f1',
        line: '#8b5cf6',
        error: '#ef4444',
    };

    // Calculate residuals for visualization
    const residuals = currentData.points.map(p => ({
        x: p.x,
        yActual: p.y,
        yPredicted: regression.slope * p.x + regression.intercept,
        residual: p.y - (regression.slope * p.x + regression.intercept),
    }));

    return (
        <div className="page metrics-page">
            <header className="page-header">
                <h1 className="page-title">Performance Metrics</h1>
                <p className="page-description">
                    How do we evaluate how well our model performs? These metrics help us
                    understand and compare different models.
                </p>
            </header>

            {/* Scenario Selector */}
            <section className="scenario-selector">
                <span className="selector-label">Select Scenario:</span>
                <div className="tabs">
                    {Object.entries(scenarios).map(([key, value]) => (
                        <button
                            key={key}
                            className={`tab ${scenario === key ? 'active' : ''}`}
                            onClick={() => setScenario(key)}
                        >
                            {value.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Visualization */}
            <section className="metrics-viz">
                <div className="viz-plot">
                    <Plot
                        data={[
                            // Data points
                            {
                                x: currentData.points.map(p => p.x),
                                y: currentData.points.map(p => p.y),
                                type: 'scatter',
                                mode: 'markers',
                                name: 'Actual',
                                marker: { color: colors.point, size: 12 },
                            },
                            // Regression line
                            {
                                x: [0, 11],
                                y: [regression.intercept, regression.slope * 11 + regression.intercept],
                                type: 'scatter',
                                mode: 'lines',
                                name: 'Predicted',
                                line: { color: colors.line, width: 3 },
                            },
                            // Error lines
                            ...residuals.map(r => ({
                                x: [r.x, r.x],
                                y: [r.yActual, r.yPredicted],
                                type: 'scatter',
                                mode: 'lines',
                                showlegend: false,
                                line: { color: colors.error, width: 1, dash: 'dot' },
                                hoverinfo: 'skip',
                            })),
                        ]}
                        layout={{
                            autosize: true,
                            margin: { l: 50, r: 30, t: 30, b: 50 },
                            paper_bgcolor: colors.bg,
                            plot_bgcolor: colors.bg,
                            font: { color: colors.text },
                            xaxis: { title: 'X', gridcolor: colors.grid, range: [0, 11] },
                            yaxis: { title: 'Y', gridcolor: colors.grid },
                            showlegend: true,
                            legend: { x: 0.02, y: 0.98 },
                        }}
                        config={{ displayModeBar: false, responsive: true }}
                        style={{ width: '100%', height: '350px' }}
                        useResizeHandler={true}
                    />
                </div>

                {/* Metrics Display */}
                <div className="viz-metrics">
                    <div className={`metric-card ${metrics.mse < 5 ? 'good' : metrics.mse < 20 ? 'moderate' : 'poor'}`}>
                        <div className="metric-icon"><BarChart2 size={24} /></div>
                        <div className="metric-info">
                            <span className="metric-name">MSE</span>
                            <span className="metric-value">{formatNumber(metrics.mse, 3)}</span>
                        </div>
                    </div>

                    <div className={`metric-card ${metrics.rmse < 2 ? 'good' : metrics.rmse < 5 ? 'moderate' : 'poor'}`}>
                        <div className="metric-icon"><Target size={24} /></div>
                        <div className="metric-info">
                            <span className="metric-name">RMSE</span>
                            <span className="metric-value">{formatNumber(metrics.rmse, 3)}</span>
                        </div>
                    </div>

                    <div className={`metric-card ${metrics.mae < 2 ? 'good' : metrics.mae < 4 ? 'moderate' : 'poor'}`}>
                        <div className="metric-icon"><TrendingUp size={24} /></div>
                        <div className="metric-info">
                            <span className="metric-name">MAE</span>
                            <span className="metric-value">{formatNumber(metrics.mae, 3)}</span>
                        </div>
                    </div>

                    <div className={`metric-card ${metrics.r2 > 0.8 ? 'good' : metrics.r2 > 0.5 ? 'moderate' : 'poor'}`}>
                        <div className="metric-icon"><Award size={24} /></div>
                        <div className="metric-info">
                            <span className="metric-name">R² Score</span>
                            <span className="metric-value">{formatNumber(metrics.r2, 3)}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Metric Explanations */}
            <section className="section">
                <h2 className="section-title">Understanding Each Metric</h2>

                <div className="metric-explanation">
                    <div className="exp-card">
                        <div className="exp-header">
                            <h3>MSE (Mean Squared Error)</h3>
                            <div className="exp-formula">MSE = (1/n) × Σ(y - ŷ)²</div>
                        </div>
                        <div className="exp-content">
                            <p>Average of squared differences between actual and predicted values.</p>
                            <ul>
                                <li><strong>Range:</strong> [0, ∞) — lower is better</li>
                                <li><strong>Units:</strong> Squared units of y</li>
                                <li><strong>Sensitivity:</strong> Heavily penalizes large errors</li>
                            </ul>
                            <div className="exp-interpretation">
                                <span className="int-label">Interpretation:</span>
                                <span>MSE = 0 means perfect predictions. Higher values indicate worse fit.</span>
                            </div>
                        </div>
                    </div>

                    <div className="exp-card">
                        <div className="exp-header">
                            <h3>RMSE (Root Mean Squared Error)</h3>
                            <div className="exp-formula">RMSE = √MSE</div>
                        </div>
                        <div className="exp-content">
                            <p>Square root of MSE — brings error back to original units.</p>
                            <ul>
                                <li><strong>Range:</strong> [0, ∞) — lower is better</li>
                                <li><strong>Units:</strong> Same units as y</li>
                                <li><strong>Advantage:</strong> More interpretable than MSE</li>
                            </ul>
                            <div className="exp-interpretation">
                                <span className="int-label">Interpretation:</span>
                                <span>RMSE of 2 means predictions are off by ~2 units on average.</span>
                            </div>
                        </div>
                    </div>

                    <div className="exp-card">
                        <div className="exp-header">
                            <h3>MAE (Mean Absolute Error)</h3>
                            <div className="exp-formula">MAE = (1/n) × Σ|y - ŷ|</div>
                        </div>
                        <div className="exp-content">
                            <p>Average of absolute differences — all errors weighted equally.</p>
                            <ul>
                                <li><strong>Range:</strong> [0, ∞) — lower is better</li>
                                <li><strong>Units:</strong> Same units as y</li>
                                <li><strong>Robustness:</strong> Less sensitive to outliers than MSE</li>
                            </ul>
                            <div className="exp-interpretation">
                                <span className="int-label">Interpretation:</span>
                                <span>MAE of 1.5 means predictions are off by 1.5 units on average.</span>
                            </div>
                        </div>
                    </div>

                    <div className="exp-card highlight">
                        <div className="exp-header">
                            <h3>R² Score (Coefficient of Determination)</h3>
                            <div className="exp-formula">R² = 1 - (SS<sub>res</sub> / SS<sub>tot</sub>)</div>
                        </div>
                        <div className="exp-content">
                            <p>Proportion of variance in y explained by the model.</p>
                            <ul>
                                <li><strong>Range:</strong> (-∞, 1] — higher is better, 1 is perfect</li>
                                <li><strong>Units:</strong> Unitless (proportion)</li>
                                <li><strong>Meaning:</strong> How much better than simply predicting the mean</li>
                            </ul>
                            <div className="r2-scale">
                                <div className="scale-bar">
                                    <div className="scale-segment poor">Poor</div>
                                    <div className="scale-segment moderate">Moderate</div>
                                    <div className="scale-segment good">Good</div>
                                    <div className="scale-segment excellent">Excellent</div>
                                </div>
                                <div className="scale-values">
                                    <span>0</span>
                                    <span>0.5</span>
                                    <span>0.7</span>
                                    <span>0.9</span>
                                    <span>1.0</span>
                                </div>
                            </div>
                            <div className="exp-interpretation">
                                <span className="int-label">Interpretation:</span>
                                <span>R² = 0.85 means 85% of variance in y is explained by the model.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="section">
                <h2 className="section-title">Quick Reference</h2>
                <div className="reference-table">
                    <div className="ref-header">
                        <span>Metric</span>
                        <span>Best Value</span>
                        <span>Units</span>
                        <span>Use When</span>
                    </div>
                    <div className="ref-row">
                        <span>MSE</span>
                        <span>0</span>
                        <span>y²</span>
                        <span>Standard loss function, optimization</span>
                    </div>
                    <div className="ref-row">
                        <span>RMSE</span>
                        <span>0</span>
                        <span>y</span>
                        <span>Reporting error in interpretable units</span>
                    </div>
                    <div className="ref-row">
                        <span>MAE</span>
                        <span>0</span>
                        <span>y</span>
                        <span>When outliers present, equal error weighting</span>
                    </div>
                    <div className="ref-row">
                        <span>R²</span>
                        <span>1</span>
                        <span>—</span>
                        <span>Explaining model's explanatory power</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Metrics;
