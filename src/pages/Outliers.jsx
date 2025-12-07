/**
 * Outliers Page
 * Understanding outliers and their effect on regression
 */

import { useState, useMemo, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { useTheme } from '../context/ThemeContext';
import {
    calculateLinearRegression,
    calculateAllMetrics,
    formatNumber,
} from '../utils/regressionMath';
import { AlertTriangle, Eye, EyeOff, RefreshCw } from 'lucide-react';
import './Outliers.css';

const Outliers = () => {
    const { isDark } = useTheme();

    // Base data without outliers
    const basePoints = [
        { x: 1, y: 2.1 }, { x: 2, y: 4.2 }, { x: 3, y: 5.8 },
        { x: 4, y: 8.1 }, { x: 5, y: 10.2 }, { x: 6, y: 12.0 },
        { x: 7, y: 13.9 }, { x: 8, y: 16.1 }, { x: 9, y: 18.0 }, { x: 10, y: 20.2 }
    ];

    // Outlier configs
    const [outlierY, setOutlierY] = useState(35);
    const [outlierX, setOutlierX] = useState(5);
    const [showOutlier, setShowOutlier] = useState(true);

    // Points with/without outlier
    const pointsWithOutlier = useMemo(() => {
        return [...basePoints.slice(0, outlierX - 1), { x: outlierX, y: outlierY }, ...basePoints.slice(outlierX)];
    }, [outlierX, outlierY]);

    const currentPoints = showOutlier ? pointsWithOutlier : basePoints;

    // Calculate regression for both cases
    const regWithOutlier = useMemo(() => calculateLinearRegression(pointsWithOutlier), [pointsWithOutlier]);
    const regWithoutOutlier = useMemo(() => calculateLinearRegression(basePoints), []);

    const metricsWithOutlier = useMemo(() =>
        calculateAllMetrics(pointsWithOutlier, regWithOutlier.slope, regWithOutlier.intercept),
        [pointsWithOutlier, regWithOutlier]
    );

    const metricsWithoutOutlier = useMemo(() =>
        calculateAllMetrics(basePoints, regWithoutOutlier.slope, regWithoutOutlier.intercept),
        [regWithoutOutlier]
    );

    const currentReg = showOutlier ? regWithOutlier : regWithoutOutlier;
    const currentMetrics = showOutlier ? metricsWithOutlier : metricsWithoutOutlier;

    // Plot colors
    const colors = {
        bg: isDark ? '#1e1e32' : '#ffffff',
        grid: isDark ? '#2d2d44' : '#e5e7eb',
        text: isDark ? '#cbd5e1' : '#4a4a68',
        point: '#6366f1',
        outlier: '#ef4444',
        lineWith: '#ef4444',
        lineWithout: '#10b981',
    };

    return (
        <div className="page outliers-page">
            <header className="page-header">
                <h1 className="page-title">Outliers & Their Effect</h1>
                <p className="page-description">
                    Outliers are data points that deviate significantly from other observations.
                    See how a single outlier can dramatically affect the regression line.
                </p>
            </header>

            {/* Interactive Demo */}
            <section className="outlier-demo">
                {/* Controls */}
                <div className="demo-controls">
                    <div className="control-group">
                        <h4>Outlier Position</h4>
                        <div className="slider-container">
                            <div className="slider-header">
                                <span className="slider-label">Y Value</span>
                                <span className="slider-value">{outlierY}</span>
                            </div>
                            <input
                                type="range"
                                className="slider"
                                min="5"
                                max="50"
                                value={outlierY}
                                onChange={(e) => setOutlierY(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="slider-container">
                            <div className="slider-header">
                                <span className="slider-label">X Position</span>
                                <span className="slider-value">{outlierX}</span>
                            </div>
                            <input
                                type="range"
                                className="slider"
                                min="1"
                                max="10"
                                value={outlierX}
                                onChange={(e) => setOutlierX(parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="control-group">
                        <h4>Toggle</h4>
                        <button
                            className={`btn ${showOutlier ? 'btn-danger' : 'btn-primary'}`}
                            onClick={() => setShowOutlier(!showOutlier)}
                        >
                            {showOutlier ? <EyeOff size={16} /> : <Eye size={16} />}
                            {showOutlier ? 'Remove Outlier' : 'Add Outlier'}
                        </button>
                    </div>
                </div>

                {/* Plot */}
                <div className="demo-plot">
                    <Plot
                        data={[
                            // Base points
                            {
                                x: basePoints.map(p => p.x),
                                y: basePoints.map(p => p.y),
                                type: 'scatter',
                                mode: 'markers',
                                name: 'Normal Points',
                                marker: { color: colors.point, size: 12 },
                            },
                            // Outlier point
                            ...(showOutlier ? [{
                                x: [outlierX],
                                y: [outlierY],
                                type: 'scatter',
                                mode: 'markers',
                                name: 'Outlier',
                                marker: {
                                    color: colors.outlier,
                                    size: 16,
                                    symbol: 'x',
                                    line: { width: 3 }
                                },
                            }] : []),
                            // Clean regression line
                            {
                                x: [0, 11],
                                y: [regWithoutOutlier.intercept, regWithoutOutlier.slope * 11 + regWithoutOutlier.intercept],
                                type: 'scatter',
                                mode: 'lines',
                                name: 'Without Outlier',
                                line: { color: colors.lineWithout, width: 3, dash: showOutlier ? 'dash' : 'solid' },
                            },
                            // Outlier affected line
                            ...(showOutlier ? [{
                                x: [0, 11],
                                y: [regWithOutlier.intercept, regWithOutlier.slope * 11 + regWithOutlier.intercept],
                                type: 'scatter',
                                mode: 'lines',
                                name: 'With Outlier',
                                line: { color: colors.lineWith, width: 3 },
                            }] : []),
                        ]}
                        layout={{
                            autosize: true,
                            margin: { l: 50, r: 30, t: 30, b: 50 },
                            paper_bgcolor: colors.bg,
                            plot_bgcolor: colors.bg,
                            font: { color: colors.text },
                            xaxis: { title: 'X', gridcolor: colors.grid, range: [0, 11] },
                            yaxis: { title: 'Y', gridcolor: colors.grid, range: [0, 55] },
                            showlegend: true,
                            legend: { x: 0.02, y: 0.98 },
                        }}
                        config={{ displayModeBar: false, responsive: true }}
                        style={{ width: '100%', height: '400px' }}
                        useResizeHandler={true}
                    />
                </div>

                {/* Metrics Comparison */}
                <div className="metrics-comparison">
                    <div className="comparison-header">
                        <span></span>
                        <span className="with-label">With Outlier</span>
                        <span className="without-label">Without Outlier</span>
                        <span>Change</span>
                    </div>

                    <div className="comparison-row">
                        <span className="row-label">Slope (m)</span>
                        <span className="with-value">{formatNumber(regWithOutlier.slope, 4)}</span>
                        <span className="without-value">{formatNumber(regWithoutOutlier.slope, 4)}</span>
                        <span className={`change ${Math.abs(regWithOutlier.slope - regWithoutOutlier.slope) > 0.1 ? 'significant' : ''}`}>
                            {((regWithOutlier.slope - regWithoutOutlier.slope) >= 0 ? '+' : '')}
                            {formatNumber(regWithOutlier.slope - regWithoutOutlier.slope, 4)}
                        </span>
                    </div>

                    <div className="comparison-row">
                        <span className="row-label">Intercept (b)</span>
                        <span className="with-value">{formatNumber(regWithOutlier.intercept, 4)}</span>
                        <span className="without-value">{formatNumber(regWithoutOutlier.intercept, 4)}</span>
                        <span className="change">
                            {((regWithOutlier.intercept - regWithoutOutlier.intercept) >= 0 ? '+' : '')}
                            {formatNumber(regWithOutlier.intercept - regWithoutOutlier.intercept, 4)}
                        </span>
                    </div>

                    <div className="comparison-row">
                        <span className="row-label">MSE</span>
                        <span className="with-value">{formatNumber(metricsWithOutlier.mse, 4)}</span>
                        <span className="without-value">{formatNumber(metricsWithoutOutlier.mse, 4)}</span>
                        <span className={`change ${metricsWithOutlier.mse > metricsWithoutOutlier.mse * 2 ? 'significant' : ''}`}>
                            {formatNumber((metricsWithOutlier.mse / metricsWithoutOutlier.mse - 1) * 100, 1)}%
                        </span>
                    </div>

                    <div className="comparison-row">
                        <span className="row-label">R² Score</span>
                        <span className="with-value">{formatNumber(metricsWithOutlier.r2, 4)}</span>
                        <span className="without-value">{formatNumber(metricsWithoutOutlier.r2, 4)}</span>
                        <span className={`change ${metricsWithOutlier.r2 < metricsWithoutOutlier.r2 - 0.1 ? 'significant' : ''}`}>
                            {formatNumber((metricsWithOutlier.r2 - metricsWithoutOutlier.r2) * 100, 1)}%
                        </span>
                    </div>
                </div>
            </section>

            {/* Explanation */}
            <section className="section">
                <h2 className="section-title">
                    <AlertTriangle size={24} />
                    Why Outliers Matter
                </h2>
                <div className="section-content">
                    <div className="explanation-grid">
                        <div className="explanation-card">
                            <h4>🎯 They Pull the Line</h4>
                            <p>
                                Since OLS minimizes squared errors, a single outlier can dramatically
                                shift the regression line toward it. The farther the outlier, the
                                stronger the pull.
                            </p>
                        </div>

                        <div className="explanation-card">
                            <h4>📉 They Inflate MSE</h4>
                            <p>
                                Outliers contribute disproportionately to MSE because errors are
                                squared. One large error can dominate the entire loss function.
                            </p>
                        </div>

                        <div className="explanation-card">
                            <h4>🎲 They Reduce R²</h4>
                            <p>
                                Outliers increase residual variance, reducing R² and making the
                                model appear to explain less of the data's variability.
                            </p>
                        </div>

                        <div className="explanation-card">
                            <h4>🔮 They Hurt Predictions</h4>
                            <p>
                                A biased regression line leads to poor predictions for normal
                                data points, not just the outlier itself.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Handling Strategies */}
            <section className="section">
                <h2 className="section-title">Strategies for Handling Outliers</h2>
                <div className="strategies-grid">
                    <div className="strategy-card">
                        <span className="strategy-number">1</span>
                        <h4>Investigate First</h4>
                        <p>
                            Is it a data entry error? Measurement issue? Or a genuine rare event?
                            Understanding the cause is crucial.
                        </p>
                    </div>

                    <div className="strategy-card">
                        <span className="strategy-number">2</span>
                        <h4>Use Robust Regression</h4>
                        <p>
                            Methods like Huber regression or RANSAC are less sensitive to outliers
                            than ordinary least squares.
                        </p>
                    </div>

                    <div className="strategy-card">
                        <span className="strategy-number">3</span>
                        <h4>Remove with Caution</h4>
                        <p>
                            If truly erroneous, removal may be justified. But document and justify
                            the decision transparently.
                        </p>
                    </div>

                    <div className="strategy-card">
                        <span className="strategy-number">4</span>
                        <h4>Use MAE Instead of MSE</h4>
                        <p>
                            MAE treats all errors linearly, reducing the outsized influence of
                            extreme values.
                        </p>
                    </div>
                </div>
            </section>

            {/* Key Insight */}
            <section className="section">
                <div className="insight-box">
                    <h3>💡 Key Insight</h3>
                    <p>
                        Move the outlier slider up and down to see its effect in real-time.
                        Notice how even a single point can completely change the regression
                        line's slope and intercept. This is why data quality and outlier
                        detection are crucial steps in any ML pipeline!
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Outliers;
