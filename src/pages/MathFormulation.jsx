/**
 * Mathematical Formulation Page
 * Deep dive into the math behind linear regression
 */

import { Calculator, ArrowRight, BookOpen } from 'lucide-react';
import './MathFormulation.css';

const MathFormulation = () => {
    return (
        <div className="page math-page">
            <header className="page-header">
                <h1 className="page-title">Mathematical Formulation</h1>
                <p className="page-description">
                    Understanding the mathematical foundations of linear regression — from
                    hypothesis to optimization.
                </p>
            </header>

            {/* Hypothesis */}
            <section className="section">
                <h2 className="section-title">
                    <Calculator size={24} />
                    The Hypothesis Function
                </h2>
                <div className="section-content">
                    <div className="math-block main-formula">
                        <span className="formula-label">Simple Linear Regression</span>
                        <div className="formula-display">
                            h<sub>θ</sub>(x) = θ₀ + θ₁x
                        </div>
                        <p className="formula-note">
                            Also written as: <strong>ŷ = b + mx</strong> or <strong>ŷ = w₀ + w₁x</strong>
                        </p>
                    </div>

                    <div className="notation-grid">
                        <div className="notation-item">
                            <span className="notation-symbol">h<sub>θ</sub>(x)</span>
                            <span className="notation-name">Hypothesis</span>
                            <span className="notation-desc">Predicted output value</span>
                        </div>
                        <div className="notation-item">
                            <span className="notation-symbol">θ₀</span>
                            <span className="notation-name">Intercept / Bias</span>
                            <span className="notation-desc">Value when x = 0</span>
                        </div>
                        <div className="notation-item">
                            <span className="notation-symbol">θ₁</span>
                            <span className="notation-name">Slope / Weight</span>
                            <span className="notation-desc">Rate of change</span>
                        </div>
                        <div className="notation-item">
                            <span className="notation-symbol">x</span>
                            <span className="notation-name">Input Feature</span>
                            <span className="notation-desc">Independent variable</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Multiple Regression */}
            <section className="section">
                <h2 className="section-title">
                    <BookOpen size={24} />
                    Multiple Linear Regression
                </h2>
                <div className="section-content">
                    <div className="math-block">
                        <span className="formula-label">Multiple Features</span>
                        <div className="formula-display">
                            h<sub>θ</sub>(x) = θ₀ + θ₁x₁ + θ₂x₂ + ... + θₙxₙ
                        </div>
                    </div>

                    <div className="math-block vector-form">
                        <span className="formula-label">Vector Form (Compact)</span>
                        <div className="formula-display">
                            h<sub>θ</sub>(x) = θᵀx
                        </div>
                        <div className="vector-explanation">
                            <div className="vector-item">
                                <span className="vector-label">θ</span>
                                <span className="vector-content">[θ₀, θ₁, θ₂, ..., θₙ]ᵀ</span>
                                <span className="vector-desc">Parameter vector</span>
                            </div>
                            <div className="vector-item">
                                <span className="vector-label">x</span>
                                <span className="vector-content">[1, x₁, x₂, ..., xₙ]ᵀ</span>
                                <span className="vector-desc">Feature vector (with bias term)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Goal */}
            <section className="section">
                <h2 className="section-title">The Learning Goal</h2>
                <div className="section-content">
                    <div className="goal-flow">
                        <div className="goal-step">
                            <div className="goal-icon">📊</div>
                            <h4>Given: Training Data</h4>
                            <p>{'{(x₁, y₁), (x₂, y₂), ..., (xₘ, yₘ)}'}</p>
                        </div>
                        <ArrowRight size={24} className="flow-arrow" />
                        <div className="goal-step">
                            <div className="goal-icon">🔍</div>
                            <h4>Find: Parameters θ</h4>
                            <p>θ₀, θ₁ that minimize error</p>
                        </div>
                        <ArrowRight size={24} className="flow-arrow" />
                        <div className="goal-step">
                            <div className="goal-icon">🎯</div>
                            <h4>Such That: h(x) ≈ y</h4>
                            <p>Predictions match actual values</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Least Squares */}
            <section className="section">
                <h2 className="section-title">Least Squares Method</h2>
                <div className="section-content">
                    <p>
                        The most common approach to find optimal parameters is the <strong>Ordinary Least Squares (OLS)</strong> method.
                        We minimize the sum of squared residuals (differences between predicted and actual values).
                    </p>

                    <div className="derivation">
                        <div className="derivation-step">
                            <span className="step-label">1. Define the Error</span>
                            <div className="formula">
                                eᵢ = yᵢ - ŷᵢ = yᵢ - (θ₀ + θ₁xᵢ)
                            </div>
                        </div>

                        <div className="derivation-step">
                            <span className="step-label">2. Sum of Squared Errors</span>
                            <div className="formula">
                                SSE = Σᵢ eᵢ² = Σᵢ (yᵢ - θ₀ - θ₁xᵢ)²
                            </div>
                        </div>

                        <div className="derivation-step">
                            <span className="step-label">3. Take Partial Derivatives</span>
                            <div className="formula">
                                ∂SSE/∂θ₀ = -2Σᵢ(yᵢ - θ₀ - θ₁xᵢ) = 0
                            </div>
                            <div className="formula">
                                ∂SSE/∂θ₁ = -2Σᵢ xᵢ(yᵢ - θ₀ - θ₁xᵢ) = 0
                            </div>
                        </div>

                        <div className="derivation-step">
                            <span className="step-label">4. Solve for Parameters</span>
                            <div className="formula highlight">
                                θ₁ = (Σxᵢyᵢ - n·x̄·ȳ) / (Σxᵢ² - n·x̄²)
                            </div>
                            <div className="formula highlight">
                                θ₀ = ȳ - θ₁·x̄
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Matrix Form */}
            <section className="section">
                <h2 className="section-title">Matrix Formulation</h2>
                <div className="section-content">
                    <p>
                        For computational efficiency, we express the problem in matrix form:
                    </p>

                    <div className="matrix-grid">
                        <div className="matrix-item">
                            <span className="matrix-label">Design Matrix X</span>
                            <div className="matrix-display">
                                <pre>
                                    {`⎡ 1  x₁₁  x₁₂  ...  x₁ₙ ⎤
⎢ 1  x₂₁  x₂₂  ...  x₂ₙ ⎥
⎢ ⋮   ⋮    ⋮   ⋱    ⋮  ⎥
⎣ 1  xₘ₁  xₘ₂  ...  xₘₙ ⎦`}
                                </pre>
                            </div>
                            <span className="matrix-size">m × (n+1)</span>
                        </div>

                        <div className="matrix-item">
                            <span className="matrix-label">Target Vector y</span>
                            <div className="matrix-display">
                                <pre>
                                    {`⎡ y₁ ⎤
⎢ y₂ ⎥
⎢ ⋮  ⎥
⎣ yₘ ⎦`}
                                </pre>
                            </div>
                            <span className="matrix-size">m × 1</span>
                        </div>

                        <div className="matrix-item">
                            <span className="matrix-label">Parameter Vector θ</span>
                            <div className="matrix-display">
                                <pre>
                                    {`⎡ θ₀ ⎤
⎢ θ₁ ⎥
⎢ ⋮  ⎥
⎣ θₙ ⎦`}
                                </pre>
                            </div>
                            <span className="matrix-size">(n+1) × 1</span>
                        </div>
                    </div>

                    <div className="math-block">
                        <span className="formula-label">Prediction in Matrix Form</span>
                        <div className="formula-display">
                            ŷ = Xθ
                        </div>
                    </div>

                    <div className="math-block">
                        <span className="formula-label">Normal Equation (Closed-Form Solution)</span>
                        <div className="formula-display highlight">
                            θ = (XᵀX)⁻¹Xᵀy
                        </div>
                        <p className="formula-note">
                            This gives the exact optimal solution without iteration — but requires matrix inversion.
                        </p>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <section className="section">
                <h2 className="section-title">Key Takeaways</h2>
                <div className="takeaways-grid">
                    <div className="takeaway-card">
                        <span className="takeaway-number">01</span>
                        <h4>Linear in Parameters</h4>
                        <p>The model is linear in θ, not necessarily in x. We can use x², log(x), etc.</p>
                    </div>
                    <div className="takeaway-card">
                        <span className="takeaway-number">02</span>
                        <h4>Closed-Form Solution</h4>
                        <p>The Normal Equation gives exact solution but O(n³) complexity.</p>
                    </div>
                    <div className="takeaway-card">
                        <span className="takeaway-number">03</span>
                        <h4>Gradient Descent Alternative</h4>
                        <p>For large datasets, iterative optimization is more practical.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MathFormulation;
