/**
 * Interactive Regression Visualizer Component
 * Core teaching tool for understanding linear regression
 * - Click to add points
 * - Live regression line updates
 * - Real-time metrics display
 * - Outlier toggle functionality
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { useTheme } from '../../context/ThemeContext';
import {
    calculateLinearRegression,
    calculateAllMetrics,
    formatNumber,
    generateSampleDataset,
} from '../../utils/regressionMath';
import { Trash2, RotateCcw, Download, Shuffle, Eye, EyeOff } from 'lucide-react';
import './RegressionVisualizer.css';

const RegressionVisualizer = () => {
    const { isDark } = useTheme();

    // State for data points
    const [points, setPoints] = useState([]);
    const [outlierIndices, setOutlierIndices] = useState(new Set());
    const [showOutliers, setShowOutliers] = useState(true);
    const [selectedPoint, setSelectedPoint] = useState(null);

    // Ref for the plot container
    const plotContainerRef = useRef(null);

    // Ref to track current points for event handlers (avoids stale closure)
    const pointsRef = useRef(points);

    // Filter points based on outlier toggle
    const activePoints = useMemo(() => {
        if (showOutliers) return points;
        return points.filter((_, i) => !outlierIndices.has(i));
    }, [points, outlierIndices, showOutliers]);

    // Calculate regression and metrics
    const regression = useMemo(() => {
        return calculateLinearRegression(activePoints);
    }, [activePoints]);

    const metrics = useMemo(() => {
        if (activePoints.length < 2) {
            return { mse: 0, rmse: 0, mae: 0, r2: 0 };
        }
        return calculateAllMetrics(activePoints, regression.slope, regression.intercept);
    }, [activePoints, regression]);

    // Handle click on existing point to select it
    const handlePlotClick = useCallback((event) => {
        if (event.points && event.points.length > 0) {
            // Clicked on existing point - select it
            const clickedIndex = event.points[0].pointIndex;
            setSelectedPoint(clickedIndex);
        }
    }, []);

    // Keep pointsRef in sync with points
    useEffect(() => {
        pointsRef.current = points;
    }, [points]);

    // Calculate axis ranges using current points from ref
    const getAxisRangesFromRef = useCallback(() => {
        const currentPoints = pointsRef.current;
        const xVals = currentPoints.map(p => p.x);
        const yVals = currentPoints.map(p => p.y);

        const xRange = currentPoints.length > 0
            ? [Math.min(...xVals) - 1, Math.max(...xVals) + 1]
            : [0, 10];

        const yRange = currentPoints.length > 0
            ? [Math.min(...yVals) - 1, Math.max(...yVals) + 1]
            : [0, 10];

        return { xRange, yRange };
    }, []);

    // Regular getAxisRanges for non-event-handler use (e.g., layout)
    const getAxisRanges = useCallback(() => {
        const xVals = points.map(p => p.x);
        const yVals = points.map(p => p.y);

        const xRange = points.length > 0
            ? [Math.min(...xVals) - 1, Math.max(...xVals) + 1]
            : [0, 10];

        const yRange = points.length > 0
            ? [Math.min(...yVals) - 1, Math.max(...yVals) + 1]
            : [0, 10];

        return { xRange, yRange };
    }, [points]);

    // Attach native click handler to Plotly's plot area
    useEffect(() => {
        const container = plotContainerRef.current;
        if (!container) return;

        const handleNativeClick = (e) => {
            // Find the plot area
            const plotArea = container.querySelector('.nsewdrag');
            if (!plotArea) return;

            const rect = plotArea.getBoundingClientRect();

            // Check if click is within the plot area
            if (e.clientX < rect.left || e.clientX > rect.right ||
                e.clientY < rect.top || e.clientY > rect.bottom) {
                return;
            }

            // Calculate the position relative to the plot area
            const xPixel = e.clientX - rect.left;
            const yPixel = e.clientY - rect.top;

            // Get axis ranges using the ref-based function (avoids stale closure)
            const { xRange, yRange } = getAxisRangesFromRef();

            // Convert pixel coordinates to data coordinates
            const x = xRange[0] + (xPixel / rect.width) * (xRange[1] - xRange[0]);
            const y = yRange[1] - (yPixel / rect.height) * (yRange[1] - yRange[0]); // Y is inverted

            if (!isNaN(x) && !isNaN(y)) {
                setPoints(prev => [...prev, { x, y }]);
                setSelectedPoint(null);
            }
        };

        // Wait for Plotly to render, then attach listener
        const timeout = setTimeout(() => {
            const plotArea = container.querySelector('.nsewdrag');
            if (plotArea) {
                plotArea.style.cursor = 'crosshair';
                plotArea.addEventListener('click', handleNativeClick);
            }
        }, 100);

        return () => {
            clearTimeout(timeout);
            const plotArea = container.querySelector('.nsewdrag');
            if (plotArea) {
                plotArea.removeEventListener('click', handleNativeClick);
            }
        };
    }, [getAxisRangesFromRef]);

    // Remove selected point
    const removeSelectedPoint = useCallback(() => {
        if (selectedPoint !== null) {
            setPoints(prev => prev.filter((_, i) => i !== selectedPoint));
            // Update outlier indices
            setOutlierIndices(prev => {
                const newSet = new Set();
                prev.forEach(i => {
                    if (i < selectedPoint) newSet.add(i);
                    else if (i > selectedPoint) newSet.add(i - 1);
                });
                return newSet;
            });
            setSelectedPoint(null);
        }
    }, [selectedPoint]);

    // Toggle point as outlier
    const toggleOutlier = useCallback(() => {
        if (selectedPoint !== null) {
            setOutlierIndices(prev => {
                const newSet = new Set(prev);
                if (newSet.has(selectedPoint)) {
                    newSet.delete(selectedPoint);
                } else {
                    newSet.add(selectedPoint);
                }
                return newSet;
            });
        }
    }, [selectedPoint]);

    // Reset all points
    const resetPoints = useCallback(() => {
        setPoints([]);
        setOutlierIndices(new Set());
        setSelectedPoint(null);
    }, []);

    // Generate sample data
    const generateSample = useCallback((type) => {
        const newPoints = generateSampleDataset(type, 15);
        setPoints(newPoints);
        setOutlierIndices(new Set());
        setSelectedPoint(null);
    }, []);

    // Plot colors based on theme
    const plotColors = {
        bg: isDark ? '#1e1e32' : '#ffffff',
        grid: isDark ? '#2d2d44' : '#e5e7eb',
        text: isDark ? '#cbd5e1' : '#4a4a68',
        point: '#6366f1',
        outlier: '#ef4444',
        line: '#8b5cf6',
        selected: '#10b981',
    };

    // Calculate regression line points
    const xRange = points.length > 0
        ? [Math.min(...points.map(p => p.x)) - 1, Math.max(...points.map(p => p.x)) + 1]
        : [0, 10];

    const yRange = points.length > 0
        ? [Math.min(...points.map(p => p.y)) - 1, Math.max(...points.map(p => p.y)) + 1]
        : [0, 10];

    const lineX = [xRange[0], xRange[1]];
    const lineY = lineX.map(x => regression.slope * x + regression.intercept);

    // Prepare plot data
    const plotData = [
        // Regular points
        {
            x: points.filter((_, i) => !outlierIndices.has(i)).map(p => p.x),
            y: points.filter((_, i) => !outlierIndices.has(i)).map(p => p.y),
            type: 'scatter',
            mode: 'markers',
            name: 'Data Points',
            marker: {
                color: plotColors.point,
                size: 12,
                opacity: 0.8,
                line: { color: 'white', width: 2 },
            },
            hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}<extra></extra>',
        },
        // Outlier points
        {
            x: points.filter((_, i) => outlierIndices.has(i)).map(p => p.x),
            y: points.filter((_, i) => outlierIndices.has(i)).map(p => p.y),
            type: 'scatter',
            mode: 'markers',
            name: 'Outliers',
            marker: {
                color: plotColors.outlier,
                size: 12,
                symbol: 'x',
                opacity: showOutliers ? 0.8 : 0.3,
                line: { color: 'white', width: 2 },
            },
            hovertemplate: 'Outlier<br>x: %{x:.2f}<br>y: %{y:.2f}<extra></extra>',
        },
        // Regression line
        ...(activePoints.length >= 2 ? [{
            x: lineX,
            y: lineY,
            type: 'scatter',
            mode: 'lines',
            name: 'Regression Line',
            line: {
                color: plotColors.line,
                width: 3,
                dash: 'solid',
            },
            hoverinfo: 'skip',
        }] : []),
        // Selected point highlight
        ...(selectedPoint !== null && points[selectedPoint] ? [{
            x: [points[selectedPoint].x],
            y: [points[selectedPoint].y],
            type: 'scatter',
            mode: 'markers',
            name: 'Selected',
            marker: {
                color: plotColors.selected,
                size: 18,
                symbol: 'circle-open',
                line: { width: 3 },
            },
            hoverinfo: 'skip',
        }] : []),
    ];

    const plotLayout = {
        autosize: true,
        margin: { l: 50, r: 30, t: 30, b: 50 },
        paper_bgcolor: plotColors.bg,
        plot_bgcolor: plotColors.bg,
        font: { color: plotColors.text, family: 'Inter, sans-serif' },
        xaxis: {
            title: 'X',
            gridcolor: plotColors.grid,
            zerolinecolor: plotColors.grid,
            range: xRange,
        },
        yaxis: {
            title: 'Y',
            gridcolor: plotColors.grid,
            zerolinecolor: plotColors.grid,
            range: yRange,
        },
        showlegend: false,
        hovermode: 'closest',
        dragmode: false,
    };

    const plotConfig = {
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d'],
        displaylogo: false,
        responsive: true,
    };

    return (
        <div className="visualizer">
            {/* Controls */}
            <div className="visualizer-controls">
                <div className="control-group">
                    <span className="control-label">Sample Data:</span>
                    <button className="btn btn-sm btn-secondary" onClick={() => generateSample('linear')}>
                        <Shuffle size={14} /> Linear
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => generateSample('noisy')}>
                        <Shuffle size={14} /> Noisy
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => generateSample('outliers')}>
                        <Shuffle size={14} /> With Outliers
                    </button>
                </div>

                <div className="control-group">
                    <button
                        className={`btn btn-sm ${showOutliers ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => setShowOutliers(!showOutliers)}
                    >
                        {showOutliers ? <Eye size={14} /> : <EyeOff size={14} />}
                        {showOutliers ? 'Hide Outliers' : 'Show Outliers'}
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={resetPoints}>
                        <RotateCcw size={14} /> Reset
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="visualizer-content">
                {/* Plot */}
                <div className="visualizer-plot" ref={plotContainerRef}>
                    <div className="plot-instruction">
                        Click anywhere on the plot to add points
                    </div>
                    <Plot
                        data={plotData}
                        layout={plotLayout}
                        config={plotConfig}
                        onClick={handlePlotClick}
                        style={{ width: '100%', height: '100%' }}
                        useResizeHandler={true}
                    />
                </div>

                {/* Sidebar */}
                <div className="visualizer-sidebar">
                    {/* Equation Display */}
                    <div className="equation-card">
                        <h4>Regression Equation</h4>
                        <div className="equation">
                            y = <span className="value">{formatNumber(regression.slope, 3)}</span>x +
                            <span className="value">{formatNumber(regression.intercept, 3)}</span>
                        </div>
                    </div>

                    {/* Metrics Display */}
                    <div className="metrics-grid">
                        <div className="metric-box">
                            <div className="metric-label">Slope (m)</div>
                            <div className="metric-value neutral">{formatNumber(regression.slope, 4)}</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-label">Intercept (b)</div>
                            <div className="metric-value neutral">{formatNumber(regression.intercept, 4)}</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-label">MSE</div>
                            <div className="metric-value">{formatNumber(metrics.mse, 4)}</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-label">RMSE</div>
                            <div className="metric-value">{formatNumber(metrics.rmse, 4)}</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-label">MAE</div>
                            <div className="metric-value">{formatNumber(metrics.mae, 4)}</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-label">R² Score</div>
                            <div className={`metric-value ${metrics.r2 >= 0.7 ? 'positive' : metrics.r2 >= 0.4 ? 'neutral' : 'negative'}`}>
                                {formatNumber(metrics.r2, 4)}
                            </div>
                        </div>
                    </div>

                    {/* Point Actions */}
                    {selectedPoint !== null && (
                        <div className="point-actions">
                            <h4>Selected Point #{selectedPoint + 1}</h4>
                            <p>
                                ({formatNumber(points[selectedPoint]?.x, 2)}, {formatNumber(points[selectedPoint]?.y, 2)})
                            </p>
                            <div className="action-buttons">
                                <button className="btn btn-sm btn-secondary" onClick={toggleOutlier}>
                                    {outlierIndices.has(selectedPoint) ? 'Unmark Outlier' : 'Mark as Outlier'}
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={removeSelectedPoint}>
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="stats-info">
                        <div className="stat-row">
                            <span>Total Points:</span>
                            <strong>{points.length}</strong>
                        </div>
                        <div className="stat-row">
                            <span>Outliers:</span>
                            <strong className="text-error">{outlierIndices.size}</strong>
                        </div>
                        <div className="stat-row">
                            <span>Active Points:</span>
                            <strong className="text-success">{activePoints.length}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegressionVisualizer;
