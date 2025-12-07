/**
 * Gradient Descent Training Page
 * Dedicated page for GD visualization
 */

import GradientDescentSimulator from '../components/gradient/GradientDescent';
import './GradientDescentPage.css';

const GradientDescentPage = () => {
    return (
        <div className="page gd-page">
            <header className="page-header">
                <h1 className="page-title">Gradient Descent Training</h1>
                <p className="page-description">
                    Watch the training process unfold step by step. See how the model
                    iteratively improves its parameters to minimize the loss function.
                </p>
            </header>

            {/* Simulator */}
            <section className="section">
                <GradientDescentSimulator />
            </section>

            {/* Experiment Suggestions */}
            <section className="experiments">
                <h3>🧪 Experiments to Try</h3>
                <div className="experiment-grid">
                    <div className="experiment">
                        <span className="exp-icon">⚡</span>
                        <h4>High Learning Rate</h4>
                        <p>Set LR to 0.3+ and watch the model diverge!</p>
                    </div>
                    <div className="experiment">
                        <span className="exp-icon">🐢</span>
                        <h4>Low Learning Rate</h4>
                        <p>Set LR to 0.001 and see slow but stable convergence.</p>
                    </div>
                    <div className="experiment">
                        <span className="exp-icon">🎯</span>
                        <h4>Perfect Rate</h4>
                        <p>Find the sweet spot where convergence is fast and stable.</p>
                    </div>
                    <div className="experiment">
                        <span className="exp-icon">🔄</span>
                        <h4>More Iterations</h4>
                        <p>Increase iterations to see if the model improves further.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GradientDescentPage;
