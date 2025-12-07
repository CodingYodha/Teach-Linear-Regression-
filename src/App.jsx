/**
 * AI Bootcamp - Linear Regression Teaching Website
 * Main Application Component with Routing
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';

// Page imports
import Introduction from './pages/Introduction';
import MathFormulation from './pages/MathFormulation';
import CostFunctions from './pages/CostFunctions';
import Optimization from './pages/Optimization';
import Metrics from './pages/Metrics';
import Visualizer from './pages/Visualizer';
import Outliers from './pages/Outliers';
import GradientDescentPage from './pages/GradientDescentPage';
import MultipleRegression from './pages/MultipleRegression';
import NormalEquation from './pages/NormalEquation';
import Regularization from './pages/Regularization';
import About from './pages/About';

// Import global styles
import './index.css';

/**
 * Main App Component
 * Sets up routing and theme provider
 */
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Introduction / Home */}
            <Route index element={<Introduction />} />

            {/* Core Theory */}
            <Route path="math" element={<MathFormulation />} />
            <Route path="cost" element={<CostFunctions />} />
            <Route path="optimization" element={<Optimization />} />
            <Route path="metrics" element={<Metrics />} />

            {/* Interactive Components */}
            <Route path="visualizer" element={<Visualizer />} />
            <Route path="outliers" element={<Outliers />} />
            <Route path="gradient" element={<GradientDescentPage />} />

            {/* Advanced Topics */}
            <Route path="multiple" element={<MultipleRegression />} />
            <Route path="normal-equation" element={<NormalEquation />} />
            <Route path="regularization" element={<Regularization />} />

            {/* About */}
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
