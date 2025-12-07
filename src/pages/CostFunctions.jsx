/**
 * Cost Functions Page
 * Deep dive into cost/loss functions with interactive playground
 */

import CostPlayground from '../components/cost/CostPlayground';
import { Target, TrendingDown, AlertTriangle } from 'lucide-react';
import './CostFunctions.css';

const CostFunctions = () => {
    return (
        <div className="page cost-page">
            <header className="page-header">
                <h1 className="page-title">Cost / Loss Functions</h1>
                <p className="page-description">
                    How do we measure how "wrong" our predictions are? The cost function
                    quantifies the error — and guides our model to improve.
                </p>
            </header>

            {/* What is a Cost Function */}
            <section className="section">
                <h2 className="section-title">
                    <Target size={24} />
                    What is a Cost Function?
                </h2>
                <div className="section-content">
                    <p>
                        A <strong>cost function</strong> (also called loss function or objective function)
                        measures the difference between predicted values and actual values. The goal of
                        training is to <strong>minimize this cost</strong>.
                    </p>

                    <div className="cost-formula-box">
                        <div className="formula-header">General Form</div>
                        <div className="formula">
                            J(θ) = (1/m) × Σ L(y<sup>(i)</sup>, ŷ<sup>(i)</sup>)
                        </div>
                        <div className="formula-explanation">
                            <span><strong>J(θ)</strong> = Total cost as function of parameters</span>
                            <span><strong>m</strong> = Number of training examples</span>
                            <span><strong>L</strong> = Loss for single prediction</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* MSE */}
            <section className="section">
                <h2 className="section-title">
                    <TrendingDown size={24} />
                    Mean Squared Error (MSE)
                </h2>
                <div className="section-content">
                    <div className="loss-card mse">
                        <div className="loss-header">
                            <h3>MSE — The Standard Choice</h3>
                            <span className="badge badge-primary">Most Common</span>
                        </div>

                        <div className="loss-formula">
                            MSE = (1/m) × Σ(yᵢ - ŷᵢ)²
                        </div>

                        <div className="loss-details">
                            <div className="detail-item">
                                <h4>How it works</h4>
                                <p>Calculates the average of squared differences between predictions and actual values.</p>
                            </div>

                            <div className="detail-item">
                                <h4>Properties</h4>
                                <ul>
                                    <li>Always positive (squares are positive)</li>
                                    <li>Larger errors are penalized more heavily</li>
                                    <li>Smooth, differentiable everywhere</li>
                                    <li>Convex — has single global minimum</li>
                                </ul>
                            </div>

                            <div className="detail-item">
                                <h4>Advantages</h4>
                                <ul>
                                    <li>Easy to compute gradients</li>
                                    <li>Unique closed-form solution exists</li>
                                    <li>Standard in most ML libraries</li>
                                </ul>
                            </div>

                            <div className="detail-item warning">
                                <h4><AlertTriangle size={16} /> Sensitivity to Outliers</h4>
                                <p>Squaring amplifies large errors. One outlier can significantly skew the result!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAE */}
            <section className="section">
                <h2 className="section-title">Mean Absolute Error (MAE)</h2>
                <div className="section-content">
                    <div className="loss-card mae">
                        <div className="loss-header">
                            <h3>MAE — Robust Alternative</h3>
                            <span className="badge badge-success">Outlier Resistant</span>
                        </div>

                        <div className="loss-formula">
                            MAE = (1/m) × Σ|yᵢ - ŷᵢ|
                        </div>

                        <div className="loss-details">
                            <div className="detail-item">
                                <h4>How it works</h4>
                                <p>Calculates the average of absolute differences — no squaring involved.</p>
                            </div>

                            <div className="detail-item">
                                <h4>Properties</h4>
                                <ul>
                                    <li>All errors weighted equally</li>
                                    <li>Not differentiable at zero</li>
                                    <li>More robust to outliers than MSE</li>
                                </ul>
                            </div>

                            <div className="detail-item">
                                <h4>When to use</h4>
                                <ul>
                                    <li>When outliers are present in data</li>
                                    <li>When you want interpretable error units</li>
                                    <li>When all errors matter equally</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="section">
                <h2 className="section-title">MSE vs MAE Comparison</h2>
                <div className="comparison-table">
                    <div className="comp-header">
                        <span>Property</span>
                        <span>MSE</span>
                        <span>MAE</span>
                    </div>
                    <div className="comp-row">
                        <span>Formula</span>
                        <span>Σ(y-ŷ)² / m</span>
                        <span>Σ|y-ŷ| / m</span>
                    </div>
                    <div className="comp-row">
                        <span>Outlier Sensitivity</span>
                        <span className="negative">High</span>
                        <span className="positive">Low</span>
                    </div>
                    <div className="comp-row">
                        <span>Gradient</span>
                        <span className="positive">Smooth</span>
                        <span className="neutral">Non-smooth at 0</span>
                    </div>
                    <div className="comp-row">
                        <span>Optimization</span>
                        <span className="positive">Easier</span>
                        <span className="neutral">Slightly harder</span>
                    </div>
                    <div className="comp-row">
                        <span>Interpretation</span>
                        <span>Squared units</span>
                        <span className="positive">Same units as y</span>
                    </div>
                    <div className="comp-row">
                        <span>Common Use</span>
                        <span className="positive">Most models</span>
                        <span>Robust regression</span>
                    </div>
                </div>
            </section>

            {/* Interactive Playground */}
            <section className="section">
                <h2 className="section-title">🎮 Interactive Playground</h2>
                <p className="section-description">
                    Adjust the weight and bias sliders to see how the cost changes.
                    Toggle between MSE and MAE to see the difference!
                </p>
                <CostPlayground />
            </section>

            {/* Key Insight */}
            <section className="section">
                <div className="insight-box">
                    <h3>💡 Key Insight</h3>
                    <p>
                        The choice of cost function affects what the model learns. MSE will try harder
                        to reduce large errors (possibly overfitting to outliers), while MAE treats all
                        errors equally. There's no universally "best" choice — it depends on your data
                        and goals.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default CostFunctions;
