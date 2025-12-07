/**
 * Interactive Visualizer Page
 * Main regression visualizer component
 */

import RegressionVisualizer from '../components/visualizer/RegressionVisualizer';
import { MousePointer, Sparkles } from 'lucide-react';
import './Visualizer.css';

const Visualizer = () => {
    return (
        <div className="page visualizer-page">
            <header className="page-header">
                <h1 className="page-title">Interactive Regression Visualizer</h1>
                <p className="page-description">
                    The best way to understand linear regression is to see it in action.
                    Click to add points and watch the regression line update in real-time!
                </p>
            </header>

            {/* Instructions */}
            <section className="instructions">
                <div className="instruction-card">
                    <MousePointer size={24} />
                    <div>
                        <h4>Click to Add Points</h4>
                        <p>Click anywhere on the graph to add data points</p>
                    </div>
                </div>
                <div className="instruction-card">
                    <Sparkles size={24} />
                    <div>
                        <h4>Watch the Magic</h4>
                        <p>The regression line and metrics update instantly</p>
                    </div>
                </div>
            </section>

            {/* Main Visualizer */}
            <section className="section">
                <RegressionVisualizer />
            </section>

            {/* Tips */}
            <section className="viz-tips">
                <h3>💡 Things to Try</h3>
                <div className="tips-grid">
                    <div className="tip">
                        <span className="tip-num">1</span>
                        <p>Add points in a clear linear pattern and watch R² approach 1.0</p>
                    </div>
                    <div className="tip">
                        <span className="tip-num">2</span>
                        <p>Add a point far from the line (outlier) and see how metrics change</p>
                    </div>
                    <div className="tip">
                        <span className="tip-num">3</span>
                        <p>Mark the outlier and toggle "Hide Outliers" to see the effect</p>
                    </div>
                    <div className="tip">
                        <span className="tip-num">4</span>
                        <p>Generate different sample datasets to compare patterns</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Visualizer;
