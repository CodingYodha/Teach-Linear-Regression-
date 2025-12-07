/**
 * Normal Equation Page
 * Closed-form solution calculator
 */

import { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useTheme } from '../context/ThemeContext';
import {
    calculateLinearRegression,
    calculateAllMetrics,
    formatNumber,
    generateSampleDataset,
} from '../utils/regressionMath';
import { Calculator, Zap, Clock, Shuffle } from 'lucide-react';
import './NormalEquation.css';

const NormalEquation = () => {
    const { isDark } = useTheme();
    const [points, setPoints] = useState(() => generateSampleDataset('linear', 12));

    // Calculate regression using normal equation
    const regression = useMemo(() => {
        return calculateLinearRegression(points);
    }, [points]);

    const metrics = useMemo(() => {
        return calculateAllMetrics(points, regression.slope, regression.intercept);
    }, [points, regression]);

    const colors = {
        bg: isDark ? '#1e1e32' : '#ffffff',
        grid: isDark ? '#2d2d44' : '#e5e7eb',
        text: isDark ? '#cbd5e1' : '#4a4a68',
        point: '#6366f1',
        line: '#10b981',
    };

    const regenerateData = () => {
        setPoints(generateSampleDataset('linear', 12));
    };

    return (
        <div className="page normal-page">
            <header className="page-header">
                <h1 className="page-title">Normal Equation</h1>
                <p className="page-description">
                    The closed-form solution — find optimal parameters without iteration.
                    One calculation, exact answer.
                </p>
            </header>

            {/* The Formula */}
            <section className="section">
                <h2 className="section-title">
                    <Calculator size={24} />
                    The Formula
                </h2>
                <div className="section-content">
                    <div className="normal-formula">
                        <span className="formula-label">Normal Equation</span>
                        <div className="formula-display">
                            θ = (XᵀX)⁻¹Xᵀy
                        </div>
                    </div>

                    <div className="formula-breakdown">
                        <div className="breakdown-item">
                            <span className="item-symbol">Xᵀ</span>
                            <span className="item-name">Transpose of X</span>
                        </div>
                        <div className="breakdown-item">
                            <span className="item-symbol">(XᵀX)⁻¹</span>
                            <span className="item-name">Inverse of XᵀX</span>
                        </div>
                        <div className="breakdown-item">
                            <span className="item-symbol">y</span>
                            <span className="item-name">Target vector</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Calculator Demo */}
            <section className="section">
                <h2 className="section-title">
                    <Zap size={24} />
                    Live Calculator
                </h2>

                <div className="calculator-demo">
                    <div className="demo-actions">
                        <button className="btn btn-secondary" onClick={regenerateData}>
                            <Shuffle size={16} /> Generate New Data
                        </button>
                    </div>

                    <div className="demo-content">
                        {/* Data Table */}
                        <div className="data-table-container">
                            <h4>Input Data</h4>
                            <div className="data-table">
                                <div className="table-header">
                                    <span>#</span>
                                    <span>X</span>
                                    <span>Y</span>
                                </div>
                                {points.map((p, i) => (
                                    <div key={i} className="table-row">
                                        <span>{i + 1}</span>
                                        <span>{formatNumber(p.x, 2)}</span>
                                        <span>{formatNumber(p.y, 2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Calculation Steps */}
                        <div className="calculation-steps">
                            <h4>Calculation</h4>

                            <div className="step">
                                <span className="step-number">1</span>
                                <div className="step-content">
                                    <span className="step-label">Compute means</span>
                                    <div className="step-result">
                                        x̄ = {formatNumber(regression.meanX, 4)},
                                        ȳ = {formatNumber(regression.meanY, 4)}
                                    </div>
                                </div>
                            </div>

                            <div className="step">
                                <span className="step-number">2</span>
                                <div className="step-content">
                                    <span className="step-label">Calculate slope</span>
                                    <div className="step-result">
                                        m = Σ(xᵢ - x̄)(yᵢ - ȳ) / Σ(xᵢ - x̄)²
                                    </div>
                                </div>
                            </div>

                            <div className="step">
                                <span className="step-number">3</span>
                                <div className="step-content">
                                    <span className="step-label">Calculate intercept</span>
                                    <div className="step-result">
                                        b = ȳ - m × x̄
                                    </div>
                                </div>
                            </div>

                            <div className="step final">
                                <span className="step-number">✓</span>
                                <div className="step-content">
                                    <span className="step-label">Solution</span>
                                    <div className="step-result solution">
                                        <span>m = <strong>{formatNumber(regression.slope, 6)}</strong></span>
                                        <span>b = <strong>{formatNumber(regression.intercept, 6)}</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Result Plot */}
                        <div className="result-plot">
                            <h4>Result</h4>
                            <Plot
                                data={[
                                    {
                                        x: points.map(p => p.x),
                                        y: points.map(p => p.y),
                                        type: 'scatter',
                                        mode: 'markers',
                                        marker: { color: colors.point, size: 10 },
                                    },
                                    {
                                        x: [0, 12],
                                        y: [regression.intercept, regression.slope * 12 + regression.intercept],
                                        type: 'scatter',
                                        mode: 'lines',
                                        line: { color: colors.line, width: 3 },
                                    },
                                ]}
                                layout={{
                                    autosize: true,
                                    margin: { l: 40, r: 20, t: 20, b: 40 },
                                    paper_bgcolor: colors.bg,
                                    plot_bgcolor: colors.bg,
                                    font: { color: colors.text, size: 10 },
                                    xaxis: { gridcolor: colors.grid },
                                    yaxis: { gridcolor: colors.grid },
                                    showlegend: false,
                                }}
                                config={{ displayModeBar: false, responsive: true }}
                                style={{ width: '100%', height: '250px' }}
                                useResizeHandler={true}
                            />

                            <div className="result-metrics">
                                <div className="result-metric">
                                    <span>MSE</span>
                                    <strong>{formatNumber(metrics.mse, 4)}</strong>
                                </div>
                                <div className="result-metric">
                                    <span>R²</span>
                                    <strong>{formatNumber(metrics.r2, 4)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="section">
                <h2 className="section-title">
                    <Clock size={24} />
                    Normal Equation vs Gradient Descent
                </h2>
                <div className="comparison-grid">
                    <div className="comparison-card normal">
                        <h4>Normal Equation</h4>
                        <ul>
                            <li className="pro">✓ Exact solution in one step</li>
                            <li className="pro">✓ No hyperparameters to tune</li>
                            <li className="pro">✓ No need for feature scaling</li>
                            <li className="con">✗ O(n³) complexity for matrix inverse</li>
                            <li className="con">✗ Slow if n (features) is large</li>
                            <li className="con">✗ May fail if XᵀX is not invertible</li>
                        </ul>
                        <div className="when-use">
                            <strong>Use when:</strong> n {"<"} 10,000 features
                        </div>
                    </div>

                    <div className="comparison-card gd">
                        <h4>Gradient Descent</h4>
                        <ul>
                            <li className="pro">✓ Scales well to large n</li>
                            <li className="pro">✓ Works with any differentiable loss</li>
                            <li className="pro">✓ Generalizes to other algorithms</li>
                            <li className="con">✗ Requires choosing learning rate</li>
                            <li className="con">✗ Need many iterations</li>
                            <li className="con">✗ Feature scaling recommended</li>
                        </ul>
                        <div className="when-use">
                            <strong>Use when:</strong> n {">"} 10,000 features
                        </div>
                    </div>
                </div>
            </section>

            {/* When to Use */}
            <section className="section">
                <div className="insight-box">
                    <h3>💡 Key Insight</h3>
                    <p>
                        The Normal Equation is mathematically elegant and gives the exact optimal solution.
                        However, matrix inversion is computationally expensive O(n³). For modern deep learning
                        with millions of parameters, Gradient Descent (and its variants) is the only practical choice.
                        For traditional linear regression with modest feature counts, the Normal Equation is often preferred.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default NormalEquation;
