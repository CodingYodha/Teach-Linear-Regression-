/**
 * Cost Function Playground Component
 * Interactive visualization of cost/loss functions
 * - Sliders for weight and bias
 * - Real-time cost curve updates
 * - 3D cost surface visualization
 * - Learning rate visualization
 */

import { useState, useMemo, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { useTheme } from '../../context/ThemeContext';
import {
    calculateMSE,
    calculateMAE,
    generateSampleDataset,
    generateCostSurface,
    formatNumber,
} from '../../utils/regressionMath';
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react';
import './CostPlayground.css';

const CostPlayground = () => {
    const { isDark } = useTheme();

    // State
    const [points, setPoints] = useState(() => generateSampleDataset('linear', 15));
    const [weight, setWeight] = useState(1.5);
    const [bias, setBias] = useState(2);
    const [lossType, setLossType] = useState('mse'); // 'mse' or 'mae'
    const [showSurface, setShowSurface] = useState(true);

    // Calculate current cost
    const currentCost = useMemo(() => {
        if (lossType === 'mse') {
            return calculateMSE(points, weight, bias);
        }
        return calculateMAE(points, weight, bias);
    }, [points, weight, bias, lossType]);

    // Generate cost curve data (varying weight, fixed bias)
    const costCurve = useMemo(() => {
        const weights = [];
        const costs = [];

        for (let w = -3; w <= 5; w += 0.1) {
            weights.push(w);
            if (lossType === 'mse') {
                costs.push(calculateMSE(points, w, bias));
            } else {
                costs.push(calculateMAE(points, w, bias));
            }
        }

        return { weights, costs };
    }, [points, bias, lossType]);

    // Generate cost surface data
    const surfaceData = useMemo(() => {
        if (!showSurface) return null;

        const resolution = 25;
        const wRange = [-2, 4];
        const bRange = [-5, 10];

        const wStep = (wRange[1] - wRange[0]) / resolution;
        const bStep = (bRange[1] - bRange[0]) / resolution;

        const z = [];
        const x = [];
        const y = [];

        for (let i = 0; i <= resolution; i++) {
            const row = [];
            const xRow = [];
            const yRow = [];

            for (let j = 0; j <= resolution; j++) {
                const w = wRange[0] + i * wStep;
                const b = bRange[0] + j * bStep;

                xRow.push(w);
                yRow.push(b);

                let cost;
                if (lossType === 'mse') {
                    cost = calculateMSE(points, w, b);
                } else {
                    cost = calculateMAE(points, w, b);
                }
                row.push(Math.min(cost, 100)); // Cap for visualization
            }

            z.push(row);
            x.push(xRow);
            y.push(yRow);
        }

        return { x, y, z };
    }, [points, lossType, showSurface]);

    // Generate new sample data
    const regenerateData = useCallback(() => {
        setPoints(generateSampleDataset('linear', 15));
    }, []);

    // Plot colors
    const colors = {
        bg: isDark ? '#1e1e32' : '#ffffff',
        grid: isDark ? '#2d2d44' : '#e5e7eb',
        text: isDark ? '#cbd5e1' : '#4a4a68',
        line: '#8b5cf6',
        point: '#6366f1',
        marker: '#ef4444',
    };

    // 2D Cost Curve Plot
    const curvePlotData = [
        // Cost curve
        {
            x: costCurve.weights,
            y: costCurve.costs,
            type: 'scatter',
            mode: 'lines',
            name: lossType.toUpperCase(),
            line: { color: colors.line, width: 3 },
        },
        // Current position marker
        {
            x: [weight],
            y: [currentCost],
            type: 'scatter',
            mode: 'markers',
            name: 'Current',
            marker: {
                color: colors.marker,
                size: 14,
                symbol: 'circle',
                line: { color: 'white', width: 2 },
            },
        },
    ];

    const curvePlotLayout = {
        autosize: true,
        margin: { l: 60, r: 20, t: 40, b: 50 },
        paper_bgcolor: colors.bg,
        plot_bgcolor: colors.bg,
        font: { color: colors.text, family: 'Inter, sans-serif' },
        title: {
            text: `${lossType.toUpperCase()} vs Weight (bias=${formatNumber(bias, 2)})`,
            font: { size: 14 },
        },
        xaxis: {
            title: 'Weight (m)',
            gridcolor: colors.grid,
            zerolinecolor: colors.grid,
        },
        yaxis: {
            title: `${lossType.toUpperCase()} Loss`,
            gridcolor: colors.grid,
            zerolinecolor: colors.grid,
        },
        showlegend: false,
    };

    // 3D Surface Plot
    const surfacePlotData = surfaceData ? [
        {
            z: surfaceData.z,
            type: 'surface',
            colorscale: 'Viridis',
            opacity: 0.9,
            contours: {
                z: {
                    show: true,
                    usecolormap: true,
                    highlightcolor: "#42f462",
                    project: { z: true },
                },
            },
        },
        // Current position marker
        {
            x: [[weight]],
            y: [[bias]],
            z: [[currentCost]],
            type: 'scatter3d',
            mode: 'markers',
            marker: {
                color: colors.marker,
                size: 8,
                symbol: 'circle',
            },
        },
    ] : [];

    const surfacePlotLayout = {
        autosize: true,
        margin: { l: 0, r: 0, t: 30, b: 0 },
        paper_bgcolor: colors.bg,
        font: { color: colors.text, family: 'Inter, sans-serif', size: 10 },
        title: {
            text: `${lossType.toUpperCase()} Cost Surface`,
            font: { size: 14 },
        },
        scene: {
            xaxis: { title: 'Weight', gridcolor: colors.grid },
            yaxis: { title: 'Bias', gridcolor: colors.grid },
            zaxis: { title: 'Cost', gridcolor: colors.grid },
            camera: {
                eye: { x: 1.5, y: 1.5, z: 1 },
            },
        },
        showlegend: false,
    };

    // Data points plot
    const dataPlotData = [
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
        // Current regression line
        {
            x: [0, 10],
            y: [bias, weight * 10 + bias],
            type: 'scatter',
            mode: 'lines',
            name: 'Fit',
            line: { color: colors.marker, width: 3 },
        },
    ];

    const dataPlotLayout = {
        autosize: true,
        margin: { l: 50, r: 20, t: 40, b: 50 },
        paper_bgcolor: colors.bg,
        plot_bgcolor: colors.bg,
        font: { color: colors.text, family: 'Inter, sans-serif' },
        title: {
            text: 'Data & Current Fit',
            font: { size: 14 },
        },
        xaxis: {
            title: 'X',
            gridcolor: colors.grid,
            range: [-1, 11],
        },
        yaxis: {
            title: 'Y',
            gridcolor: colors.grid,
        },
        showlegend: false,
    };

    const plotConfig = {
        displayModeBar: false,
        responsive: true,
    };

    return (
        <div className="cost-playground">
            {/* Controls */}
            <div className="playground-controls">
                <div className="control-section">
                    <h4>Parameters</h4>

                    <div className="slider-container">
                        <div className="slider-header">
                            <span className="slider-label">Weight (m)</span>
                            <span className="slider-value">{formatNumber(weight, 2)}</span>
                        </div>
                        <input
                            type="range"
                            className="slider"
                            min="-3"
                            max="5"
                            step="0.1"
                            value={weight}
                            onChange={(e) => setWeight(parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="slider-container">
                        <div className="slider-header">
                            <span className="slider-label">Bias (b)</span>
                            <span className="slider-value">{formatNumber(bias, 2)}</span>
                        </div>
                        <input
                            type="range"
                            className="slider"
                            min="-5"
                            max="10"
                            step="0.1"
                            value={bias}
                            onChange={(e) => setBias(parseFloat(e.target.value))}
                        />
                    </div>
                </div>

                <div className="control-section">
                    <h4>Loss Function</h4>
                    <div className="tabs">
                        <button
                            className={`tab ${lossType === 'mse' ? 'active' : ''}`}
                            onClick={() => setLossType('mse')}
                        >
                            MSE
                        </button>
                        <button
                            className={`tab ${lossType === 'mae' ? 'active' : ''}`}
                            onClick={() => setLossType('mae')}
                        >
                            MAE
                        </button>
                    </div>
                </div>

                <div className="control-section">
                    <h4>Current Cost</h4>
                    <div className="cost-display">
                        <span className="cost-value">{formatNumber(currentCost, 4)}</span>
                        <span className="cost-label">{lossType.toUpperCase()}</span>
                    </div>
                </div>

                <div className="control-section">
                    <h4>Actions</h4>
                    <button className="btn btn-secondary" onClick={regenerateData}>
                        <Shuffle size={16} /> New Data
                    </button>
                    <div className="toggle-container">
                        <div
                            className={`toggle ${showSurface ? 'active' : ''}`}
                            onClick={() => setShowSurface(!showSurface)}
                        />
                        <span>Show 3D Surface</span>
                    </div>
                </div>
            </div>

            {/* Visualizations */}
            <div className="playground-plots">
                {/* Data Plot */}
                <div className="plot-card">
                    <Plot
                        data={dataPlotData}
                        layout={dataPlotLayout}
                        config={plotConfig}
                        style={{ width: '100%', height: '300px' }}
                        useResizeHandler={true}
                    />
                </div>

                {/* Cost Curve */}
                <div className="plot-card">
                    <Plot
                        data={curvePlotData}
                        layout={curvePlotLayout}
                        config={plotConfig}
                        style={{ width: '100%', height: '300px' }}
                        useResizeHandler={true}
                    />
                </div>

                {/* 3D Surface */}
                {showSurface && surfaceData && (
                    <div className="plot-card full-width">
                        <Plot
                            data={surfacePlotData}
                            layout={surfacePlotLayout}
                            config={{ ...plotConfig, displayModeBar: true }}
                            style={{ width: '100%', height: '400px' }}
                            useResizeHandler={true}
                        />
                    </div>
                )}
            </div>

            {/* Info Cards */}
            <div className="info-cards">
                <div className="info-card">
                    <h4>MSE (Mean Squared Error)</h4>
                    <div className="formula">MSE = (1/n) × Σ(y - ŷ)²</div>
                    <p>
                        Squares errors, making it more sensitive to outliers.
                        The loss surface is smooth and convex, making optimization easier.
                    </p>
                </div>
                <div className="info-card">
                    <h4>MAE (Mean Absolute Error)</h4>
                    <div className="formula">MAE = (1/n) × Σ|y - ŷ|</div>
                    <p>
                        Uses absolute differences, more robust to outliers.
                        The loss surface has sharper contours around the minimum.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CostPlayground;
