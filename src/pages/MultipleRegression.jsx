/**
 * Multiple Regression Page
 * Multiple linear regression with 3D visualization
 */

import { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useTheme } from '../context/ThemeContext';
import { formatNumber } from '../utils/regressionMath';
import { Layers, Box, Settings } from 'lucide-react';
import './MultipleRegression.css';

const MultipleRegression = () => {
    const { isDark } = useTheme();

    // Parameters for the plane y = w1*x1 + w2*x2 + b
    const [w1, setW1] = useState(2);
    const [w2, setW2] = useState(1.5);
    const [bias, setBias] = useState(3);

    // Generate sample data
    const sampleData = useMemo(() => {
        const points = [];
        for (let i = 0; i < 30; i++) {
            const x1 = Math.random() * 10;
            const x2 = Math.random() * 10;
            const noise = (Math.random() - 0.5) * 4;
            const y = w1 * x1 + w2 * x2 + bias + noise;
            points.push({ x1, x2, y });
        }
        return points;
    }, [w1, w2, bias]);

    // Generate surface mesh
    const surfaceData = useMemo(() => {
        const x1Range = [];
        const x2Range = [];
        const zSurface = [];

        for (let i = 0; i <= 10; i++) {
            x1Range.push(i);
            x2Range.push(i);
        }

        for (let i = 0; i <= 10; i++) {
            const row = [];
            for (let j = 0; j <= 10; j++) {
                row.push(w1 * i + w2 * j + bias);
            }
            zSurface.push(row);
        }

        return { x1Range, x2Range, zSurface };
    }, [w1, w2, bias]);

    // Plot colors
    const colors = {
        bg: isDark ? '#1e1e32' : '#ffffff',
        text: isDark ? '#cbd5e1' : '#4a4a68',
        points: '#6366f1',
        surface: 'Viridis',
    };

    return (
        <div className="page multiple-page">
            <header className="page-header">
                <h1 className="page-title">Multiple Linear Regression</h1>
                <p className="page-description">
                    Extending to multiple input features. The model becomes a hyperplane
                    in higher-dimensional space.
                </p>
            </header>

            {/* Formula */}
            <section className="section">
                <h2 className="section-title">
                    <Layers size={24} />
                    The Model
                </h2>
                <div className="section-content">
                    <div className="formula-block">
                        <span className="formula-label">Multiple Features</span>
                        <div className="formula-display">
                            y = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
                        </div>
                    </div>

                    <div className="formula-current">
                        <span>Current equation:</span>
                        <div className="equation">
                            y = <span className="coef">{formatNumber(w1, 2)}</span>x₁ +
                            <span className="coef">{formatNumber(w2, 2)}</span>x₂ +
                            <span className="coef">{formatNumber(bias, 2)}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive 3D Visualization */}
            <section className="section">
                <h2 className="section-title">
                    <Box size={24} />
                    3D Visualization (2 Features)
                </h2>

                <div className="three-d-demo">
                    {/* Controls */}
                    <div className="demo-controls">
                        <div className="control-group">
                            <h4>Parameters</h4>

                            <div className="slider-container">
                                <div className="slider-header">
                                    <span className="slider-label">Weight 1 (w₁)</span>
                                    <span className="slider-value">{formatNumber(w1, 2)}</span>
                                </div>
                                <input
                                    type="range"
                                    className="slider"
                                    min="-3"
                                    max="5"
                                    step="0.1"
                                    value={w1}
                                    onChange={(e) => setW1(parseFloat(e.target.value))}
                                />
                            </div>

                            <div className="slider-container">
                                <div className="slider-header">
                                    <span className="slider-label">Weight 2 (w₂)</span>
                                    <span className="slider-value">{formatNumber(w2, 2)}</span>
                                </div>
                                <input
                                    type="range"
                                    className="slider"
                                    min="-3"
                                    max="5"
                                    step="0.1"
                                    value={w2}
                                    onChange={(e) => setW2(parseFloat(e.target.value))}
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
                                    step="0.5"
                                    value={bias}
                                    onChange={(e) => setBias(parseFloat(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="parameter-impact">
                            <h4>Parameter Effects</h4>
                            <ul>
                                <li><strong>w₁:</strong> Tilt along x₁ axis</li>
                                <li><strong>w₂:</strong> Tilt along x₂ axis</li>
                                <li><strong>b:</strong> Shift plane up/down</li>
                            </ul>
                        </div>
                    </div>

                    {/* 3D Plot */}
                    <div className="three-d-plot">
                        <Plot
                            data={[
                                // Regression plane
                                {
                                    type: 'surface',
                                    x: surfaceData.x1Range,
                                    y: surfaceData.x2Range,
                                    z: surfaceData.zSurface,
                                    colorscale: colors.surface,
                                    opacity: 0.7,
                                    showscale: false,
                                    name: 'Regression Plane',
                                },
                                // Data points
                                {
                                    type: 'scatter3d',
                                    mode: 'markers',
                                    x: sampleData.map(p => p.x1),
                                    y: sampleData.map(p => p.x2),
                                    z: sampleData.map(p => p.y),
                                    marker: {
                                        size: 5,
                                        color: colors.points,
                                        opacity: 0.9,
                                    },
                                    name: 'Data Points',
                                },
                            ]}
                            layout={{
                                autosize: true,
                                margin: { l: 0, r: 0, t: 0, b: 0 },
                                paper_bgcolor: colors.bg,
                                font: { color: colors.text },
                                scene: {
                                    xaxis: { title: 'x₁', gridcolor: isDark ? '#2d2d44' : '#e5e7eb' },
                                    yaxis: { title: 'x₂', gridcolor: isDark ? '#2d2d44' : '#e5e7eb' },
                                    zaxis: { title: 'y', gridcolor: isDark ? '#2d2d44' : '#e5e7eb' },
                                    camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } },
                                },
                                showlegend: false,
                            }}
                            config={{ displayModeBar: true, responsive: true }}
                            style={{ width: '100%', height: '500px' }}
                            useResizeHandler={true}
                        />
                    </div>
                </div>
            </section>

            {/* Matrix Form */}
            <section className="section">
                <h2 className="section-title">
                    <Settings size={24} />
                    Matrix Representation
                </h2>
                <div className="section-content">
                    <div className="matrix-explanation">
                        <div className="matrix-block">
                            <span className="matrix-label">Prediction</span>
                            <div className="matrix-formula">ŷ = Xw</div>
                        </div>

                        <div className="matrix-block">
                            <span className="matrix-label">Optimal Solution</span>
                            <div className="matrix-formula">w = (XᵀX)⁻¹Xᵀy</div>
                        </div>
                    </div>

                    <div className="dimensions-info">
                        <div className="dim-item">
                            <span className="dim-symbol">X</span>
                            <span className="dim-size">(m × n)</span>
                            <span className="dim-desc">m samples, n features</span>
                        </div>
                        <div className="dim-item">
                            <span className="dim-symbol">w</span>
                            <span className="dim-size">(n × 1)</span>
                            <span className="dim-desc">weight vector</span>
                        </div>
                        <div className="dim-item">
                            <span className="dim-symbol">y</span>
                            <span className="dim-size">(m × 1)</span>
                            <span className="dim-desc">target vector</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* When to Use */}
            <section className="section">
                <h2 className="section-title">When to Use Multiple Regression</h2>
                <div className="use-cases">
                    <div className="use-case">
                        <span className="use-icon">🏠</span>
                        <h4>Real Estate</h4>
                        <p>Price = f(size, bedrooms, location, age...)</p>
                    </div>
                    <div className="use-case">
                        <span className="use-icon">📈</span>
                        <h4>Sales Prediction</h4>
                        <p>Sales = f(ads, price, season, promotions...)</p>
                    </div>
                    <div className="use-case">
                        <span className="use-icon">🏥</span>
                        <h4>Medical</h4>
                        <p>Risk = f(age, weight, blood pressure, lifestyle...)</p>
                    </div>
                    <div className="use-case">
                        <span className="use-icon">🌍</span>
                        <h4>Climate</h4>
                        <p>Temp = f(latitude, altitude, time, humidity...)</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MultipleRegression;
