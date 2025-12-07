/**
 * Gradient Descent Simulator Component
 * Step-by-step visualization of the optimization process
 * - Epoch animation
 * - Loss vs Epoch plot
 * - Parameter tuning (learning rate, iterations)
 * - Divergence visualization
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useTheme } from '../../context/ThemeContext';
import {
    gradientDescent,
    calculateLinearRegression,
    calculateMSE,
    generateSampleDataset,
    formatNumber,
} from '../../utils/regressionMath';
import { Play, Pause, RotateCcw, SkipForward, FastForward, Shuffle } from 'lucide-react';
import './GradientDescent.css';

const GradientDescentSimulator = () => {
    const { isDark } = useTheme();

    // Data state
    const [points, setPoints] = useState(() => generateSampleDataset('linear', 20));

    // Parameters
    const [learningRate, setLearningRate] = useState(0.01);
    const [iterations, setIterations] = useState(100);
    const [initialWeight, setInitialWeight] = useState(0);
    const [initialBias, setInitialBias] = useState(0);

    // Animation state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentEpoch, setCurrentEpoch] = useState(0);
    const [speed, setSpeed] = useState(100); // ms per epoch
    const animationRef = useRef(null);

    // Run gradient descent
    const gdResult = useMemo(() => {
        return gradientDescent(
            points,
            learningRate,
            iterations,
            initialWeight,
            initialBias
        );
    }, [points, learningRate, iterations, initialWeight, initialBias]);

    // Get optimal solution for comparison
    const optimalSolution = useMemo(() => {
        return calculateLinearRegression(points);
    }, [points]);

    // Current state at this epoch
    const currentState = useMemo(() => {
        if (currentEpoch === 0) {
            return {
                slope: initialWeight,
                intercept: initialBias,
                loss: calculateMSE(points, initialWeight, initialBias),
            };
        }
        const epochData = gdResult.history[currentEpoch - 1];
        return epochData || gdResult.history[gdResult.history.length - 1];
    }, [currentEpoch, gdResult, initialWeight, initialBias, points]);

    // Animation effect
    useEffect(() => {
        if (isPlaying && currentEpoch < gdResult.history.length) {
            animationRef.current = setTimeout(() => {
                setCurrentEpoch(prev => prev + 1);
            }, speed);
        } else if (currentEpoch >= gdResult.history.length) {
            setIsPlaying(false);
        }

        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
            }
        };
    }, [isPlaying, currentEpoch, gdResult.history.length, speed]);

    // Control functions
    const handlePlay = useCallback(() => {
        if (currentEpoch >= gdResult.history.length) {
            setCurrentEpoch(0);
        }
        setIsPlaying(true);
    }, [currentEpoch, gdResult.history.length]);

    const handlePause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const handleStep = useCallback(() => {
        if (currentEpoch < gdResult.history.length) {
            setCurrentEpoch(prev => prev + 1);
        }
    }, [currentEpoch, gdResult.history.length]);

    const handleReset = useCallback(() => {
        setIsPlaying(false);
        setCurrentEpoch(0);
    }, []);

    const handleSkipToEnd = useCallback(() => {
        setIsPlaying(false);
        setCurrentEpoch(gdResult.history.length);
    }, [gdResult.history.length]);

    const regenerateData = useCallback(() => {
        setPoints(generateSampleDataset('linear', 20));
        setCurrentEpoch(0);
        setIsPlaying(false);
    }, []);

    // Plot colors
    const colors = {
        bg: isDark ? '#1e1e32' : '#ffffff',
        grid: isDark ? '#2d2d44' : '#e5e7eb',
        text: isDark ? '#cbd5e1' : '#4a4a68',
        point: '#6366f1',
        optimal: '#10b981',
        current: '#ef4444',
        path: '#8b5cf6',
    };

    // Loss curve data
    const lossPlotData = [
        // Full loss curve (faded)
        {
            x: gdResult.history.map(h => h.epoch),
            y: gdResult.history.map(h => h.loss),
            type: 'scatter',
            mode: 'lines',
            name: 'Loss History',
            line: { color: colors.path, width: 2, opacity: 0.3 },
        },
        // Animated portion
        {
            x: gdResult.history.slice(0, currentEpoch).map(h => h.epoch),
            y: gdResult.history.slice(0, currentEpoch).map(h => h.loss),
            type: 'scatter',
            mode: 'lines',
            name: 'Current Progress',
            line: { color: colors.path, width: 3 },
        },
        // Current point
        ...(currentEpoch > 0 ? [{
            x: [currentEpoch],
            y: [currentState.loss],
            type: 'scatter',
            mode: 'markers',
            name: 'Current',
            marker: {
                color: colors.current,
                size: 12,
                line: { color: 'white', width: 2 },
            },
        }] : []),
    ];

    const lossPlotLayout = {
        autosize: true,
        margin: { l: 60, r: 20, t: 40, b: 50 },
        paper_bgcolor: colors.bg,
        plot_bgcolor: colors.bg,
        font: { color: colors.text, family: 'Inter, sans-serif' },
        title: { text: 'Loss vs Epoch', font: { size: 14 } },
        xaxis: {
            title: 'Epoch',
            gridcolor: colors.grid,
        },
        yaxis: {
            title: 'MSE Loss',
            gridcolor: colors.grid,
            type: gdResult.converged ? 'linear' : 'log',
        },
        showlegend: false,
    };

    // Regression plot data
    const regressionPlotData = [
        // Data points
        {
            x: points.map(p => p.x),
            y: points.map(p => p.y),
            type: 'scatter',
            mode: 'markers',
            name: 'Data',
            marker: {
                color: colors.point,
                size: 10,
                opacity: 0.8,
            },
        },
        // Optimal line
        {
            x: [0, 10],
            y: [optimalSolution.intercept, optimalSolution.slope * 10 + optimalSolution.intercept],
            type: 'scatter',
            mode: 'lines',
            name: 'Optimal',
            line: { color: colors.optimal, width: 2, dash: 'dash' },
        },
        // Current GD line
        {
            x: [0, 10],
            y: [currentState.intercept, currentState.slope * 10 + currentState.intercept],
            type: 'scatter',
            mode: 'lines',
            name: 'GD Current',
            line: { color: colors.current, width: 3 },
        },
    ];

    const regressionPlotLayout = {
        autosize: true,
        margin: { l: 50, r: 20, t: 40, b: 50 },
        paper_bgcolor: colors.bg,
        plot_bgcolor: colors.bg,
        font: { color: colors.text, family: 'Inter, sans-serif' },
        title: { text: 'Regression Fit', font: { size: 14 } },
        xaxis: {
            title: 'X',
            gridcolor: colors.grid,
            range: [-1, 11],
        },
        yaxis: {
            title: 'Y',
            gridcolor: colors.grid,
        },
        showlegend: true,
        legend: {
            x: 0.02,
            y: 0.98,
            bgcolor: 'rgba(0,0,0,0)',
        },
    };

    // Parameter trajectory plot
    const trajectoryPlotData = [
        // Path taken
        {
            x: [initialWeight, ...gdResult.history.slice(0, currentEpoch).map(h => h.slope)],
            y: [initialBias, ...gdResult.history.slice(0, currentEpoch).map(h => h.intercept)],
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Path',
            line: { color: colors.path, width: 2 },
            marker: { size: 4 },
        },
        // Start point
        {
            x: [initialWeight],
            y: [initialBias],
            type: 'scatter',
            mode: 'markers',
            name: 'Start',
            marker: {
                color: '#f59e0b',
                size: 14,
                symbol: 'circle',
            },
        },
        // Current point
        {
            x: [currentState.slope],
            y: [currentState.intercept],
            type: 'scatter',
            mode: 'markers',
            name: 'Current',
            marker: {
                color: colors.current,
                size: 14,
                symbol: 'circle',
                line: { color: 'white', width: 2 },
            },
        },
        // Optimal point
        {
            x: [optimalSolution.slope],
            y: [optimalSolution.intercept],
            type: 'scatter',
            mode: 'markers',
            name: 'Optimal',
            marker: {
                color: colors.optimal,
                size: 14,
                symbol: 'star',
            },
        },
    ];

    const trajectoryPlotLayout = {
        autosize: true,
        margin: { l: 60, r: 20, t: 40, b: 50 },
        paper_bgcolor: colors.bg,
        plot_bgcolor: colors.bg,
        font: { color: colors.text, family: 'Inter, sans-serif' },
        title: { text: 'Parameter Space Trajectory', font: { size: 14 } },
        xaxis: {
            title: 'Weight (m)',
            gridcolor: colors.grid,
        },
        yaxis: {
            title: 'Bias (b)',
            gridcolor: colors.grid,
        },
        showlegend: false,
    };

    const plotConfig = {
        displayModeBar: false,
        responsive: true,
    };

    // Check for divergence
    const hasDiverged = !gdResult.converged ||
        (gdResult.history.length > 0 && !isFinite(gdResult.history[gdResult.history.length - 1].loss));

    return (
        <div className="gd-simulator">
            {/* Controls Panel */}
            <div className="gd-controls">
                {/* Playback Controls */}
                <div className="control-section playback">
                    <h4>Playback</h4>
                    <div className="playback-buttons">
                        <button
                            className="btn btn-icon btn-secondary"
                            onClick={handleReset}
                            title="Reset"
                        >
                            <RotateCcw size={18} />
                        </button>

                        {isPlaying ? (
                            <button
                                className="btn btn-icon btn-primary"
                                onClick={handlePause}
                                title="Pause"
                            >
                                <Pause size={18} />
                            </button>
                        ) : (
                            <button
                                className="btn btn-icon btn-primary"
                                onClick={handlePlay}
                                title="Play"
                            >
                                <Play size={18} />
                            </button>
                        )}

                        <button
                            className="btn btn-icon btn-secondary"
                            onClick={handleStep}
                            disabled={currentEpoch >= gdResult.history.length}
                            title="Step"
                        >
                            <SkipForward size={18} />
                        </button>

                        <button
                            className="btn btn-icon btn-secondary"
                            onClick={handleSkipToEnd}
                            title="Skip to End"
                        >
                            <FastForward size={18} />
                        </button>
                    </div>

                    <div className="epoch-display">
                        <span>Epoch</span>
                        <strong>{currentEpoch} / {iterations}</strong>
                    </div>
                </div>

                {/* Learning Rate */}
                <div className="control-section">
                    <h4>Learning Rate</h4>
                    <div className="slider-container">
                        <div className="slider-header">
                            <span className="slider-value">{learningRate.toFixed(4)}</span>
                        </div>
                        <input
                            type="range"
                            className="slider"
                            min="0.001"
                            max="0.5"
                            step="0.001"
                            value={learningRate}
                            onChange={(e) => {
                                setLearningRate(parseFloat(e.target.value));
                                handleReset();
                            }}
                        />
                    </div>
                    {learningRate > 0.1 && (
                        <span className="warning-text">⚠️ High LR may diverge!</span>
                    )}
                </div>

                {/* Iterations */}
                <div className="control-section">
                    <h4>Iterations</h4>
                    <div className="slider-container">
                        <div className="slider-header">
                            <span className="slider-value">{iterations}</span>
                        </div>
                        <input
                            type="range"
                            className="slider"
                            min="10"
                            max="500"
                            step="10"
                            value={iterations}
                            onChange={(e) => {
                                setIterations(parseInt(e.target.value));
                                handleReset();
                            }}
                        />
                    </div>
                </div>

                {/* Speed */}
                <div className="control-section">
                    <h4>Animation Speed</h4>
                    <div className="slider-container">
                        <div className="slider-header">
                            <span className="slider-value">{speed}ms</span>
                        </div>
                        <input
                            type="range"
                            className="slider"
                            min="10"
                            max="500"
                            step="10"
                            value={speed}
                            onChange={(e) => setSpeed(parseInt(e.target.value))}
                        />
                    </div>
                </div>

                {/* Data */}
                <div className="control-section">
                    <h4>Data</h4>
                    <button className="btn btn-secondary btn-sm" onClick={regenerateData}>
                        <Shuffle size={14} /> Regenerate
                    </button>
                </div>
            </div>

            {/* Status Badges */}
            <div className="gd-status">
                {hasDiverged ? (
                    <div className="badge badge-error">⚠️ Diverged! Try lower learning rate</div>
                ) : gdResult.converged && currentEpoch === iterations ? (
                    <div className="badge badge-success">✓ Converged</div>
                ) : (
                    <div className="badge badge-primary">Running...</div>
                )}
            </div>

            {/* Metrics Display */}
            <div className="gd-metrics">
                <div className="metric-box">
                    <div className="metric-label">Current Loss</div>
                    <div className={`metric-value ${hasDiverged ? 'negative' : ''}`}>
                        {formatNumber(currentState.loss, 4)}
                    </div>
                </div>
                <div className="metric-box">
                    <div className="metric-label">Weight (m)</div>
                    <div className="metric-value neutral">{formatNumber(currentState.slope, 4)}</div>
                </div>
                <div className="metric-box">
                    <div className="metric-label">Bias (b)</div>
                    <div className="metric-value neutral">{formatNumber(currentState.intercept, 4)}</div>
                </div>
                <div className="metric-box">
                    <div className="metric-label">Optimal Weight</div>
                    <div className="metric-value positive">{formatNumber(optimalSolution.slope, 4)}</div>
                </div>
                <div className="metric-box">
                    <div className="metric-label">Optimal Bias</div>
                    <div className="metric-value positive">{formatNumber(optimalSolution.intercept, 4)}</div>
                </div>
                <div className="metric-box">
                    <div className="metric-label">Weight Error</div>
                    <div className="metric-value">
                        {formatNumber(Math.abs(currentState.slope - optimalSolution.slope), 4)}
                    </div>
                </div>
            </div>

            {/* Plots */}
            <div className="gd-plots">
                <div className="plot-card">
                    <Plot
                        data={lossPlotData}
                        layout={lossPlotLayout}
                        config={plotConfig}
                        style={{ width: '100%', height: '300px' }}
                        useResizeHandler={true}
                    />
                </div>

                <div className="plot-card">
                    <Plot
                        data={regressionPlotData}
                        layout={regressionPlotLayout}
                        config={plotConfig}
                        style={{ width: '100%', height: '300px' }}
                        useResizeHandler={true}
                    />
                </div>

                <div className="plot-card">
                    <Plot
                        data={trajectoryPlotData}
                        layout={trajectoryPlotLayout}
                        config={plotConfig}
                        style={{ width: '100%', height: '300px' }}
                        useResizeHandler={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default GradientDescentSimulator;
