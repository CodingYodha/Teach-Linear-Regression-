/**
 * Linear Regression Mathematical Utilities
 * Core functions for regression calculations, metrics, and optimization
 */

/**
 * Calculate simple linear regression (y = mx + b)
 * Using least squares method
 * @param {Array} points - Array of {x, y} objects
 * @returns {Object} slope (m), intercept (b), and predictions
 */
export const calculateLinearRegression = (points) => {
    if (points.length < 2) {
        return { slope: 0, intercept: 0, predictions: [] };
    }

    const n = points.length;

    // Calculate means
    const sumX = points.reduce((acc, p) => acc + p.x, 0);
    const sumY = points.reduce((acc, p) => acc + p.y, 0);
    const meanX = sumX / n;
    const meanY = sumY / n;

    // Calculate slope (m)
    let numerator = 0;
    let denominator = 0;

    points.forEach(p => {
        numerator += (p.x - meanX) * (p.y - meanY);
        denominator += (p.x - meanX) ** 2;
    });

    // Avoid division by zero
    const slope = denominator !== 0 ? numerator / denominator : 0;

    // Calculate intercept (b)
    const intercept = meanY - slope * meanX;

    // Calculate predictions
    const predictions = points.map(p => ({
        x: p.x,
        yActual: p.y,
        yPredicted: slope * p.x + intercept,
    }));

    return { slope, intercept, predictions, meanX, meanY };
};

/**
 * Calculate Mean Squared Error (MSE)
 * MSE = (1/n) * Σ(y_actual - y_predicted)²
 * @param {Array} points - Array of {x, y} objects
 * @param {number} slope - Regression line slope
 * @param {number} intercept - Regression line intercept
 * @returns {number} MSE value
 */
export const calculateMSE = (points, slope, intercept) => {
    if (points.length === 0) return 0;

    const sumSquaredError = points.reduce((acc, p) => {
        const predicted = slope * p.x + intercept;
        return acc + (p.y - predicted) ** 2;
    }, 0);

    return sumSquaredError / points.length;
};

/**
 * Calculate Root Mean Squared Error (RMSE)
 * RMSE = √MSE
 * @param {Array} points - Array of {x, y} objects
 * @param {number} slope - Regression line slope
 * @param {number} intercept - Regression line intercept
 * @returns {number} RMSE value
 */
export const calculateRMSE = (points, slope, intercept) => {
    return Math.sqrt(calculateMSE(points, slope, intercept));
};

/**
 * Calculate Mean Absolute Error (MAE)
 * MAE = (1/n) * Σ|y_actual - y_predicted|
 * @param {Array} points - Array of {x, y} objects
 * @param {number} slope - Regression line slope
 * @param {number} intercept - Regression line intercept
 * @returns {number} MAE value
 */
export const calculateMAE = (points, slope, intercept) => {
    if (points.length === 0) return 0;

    const sumAbsoluteError = points.reduce((acc, p) => {
        const predicted = slope * p.x + intercept;
        return acc + Math.abs(p.y - predicted);
    }, 0);

    return sumAbsoluteError / points.length;
};

/**
 * Calculate R² Score (Coefficient of Determination)
 * R² = 1 - (SS_res / SS_tot)
 * Where SS_res = Σ(y - y_pred)² and SS_tot = Σ(y - y_mean)²
 * @param {Array} points - Array of {x, y} objects
 * @param {number} slope - Regression line slope
 * @param {number} intercept - Regression line intercept
 * @returns {number} R² value (0 to 1, can be negative if model is poor)
 */
export const calculateR2 = (points, slope, intercept) => {
    if (points.length < 2) return 0;

    const meanY = points.reduce((acc, p) => acc + p.y, 0) / points.length;

    // Sum of squared residuals
    const ssRes = points.reduce((acc, p) => {
        const predicted = slope * p.x + intercept;
        return acc + (p.y - predicted) ** 2;
    }, 0);

    // Total sum of squares
    const ssTot = points.reduce((acc, p) => {
        return acc + (p.y - meanY) ** 2;
    }, 0);

    // Avoid division by zero
    if (ssTot === 0) return 0;

    return 1 - (ssRes / ssTot);
};

/**
 * Calculate all metrics at once
 * @param {Array} points - Array of {x, y} objects
 * @param {number} slope - Regression line slope
 * @param {number} intercept - Regression line intercept
 * @returns {Object} All metrics
 */
export const calculateAllMetrics = (points, slope, intercept) => {
    return {
        mse: calculateMSE(points, slope, intercept),
        rmse: calculateRMSE(points, slope, intercept),
        mae: calculateMAE(points, slope, intercept),
        r2: calculateR2(points, slope, intercept),
    };
};

/**
 * Perform gradient descent optimization
 * @param {Array} points - Training data points
 * @param {number} learningRate - Step size for updates
 * @param {number} iterations - Number of epochs
 * @param {number} initialSlope - Starting slope value
 * @param {number} initialIntercept - Starting intercept value
 * @returns {Object} Optimization history and final parameters
 */
export const gradientDescent = (
    points,
    learningRate = 0.01,
    iterations = 100,
    initialSlope = 0,
    initialIntercept = 0
) => {
    let slope = initialSlope;
    let intercept = initialIntercept;
    const n = points.length;
    const history = [];

    for (let i = 0; i < iterations; i++) {
        // Calculate gradients
        let slopeGradient = 0;
        let interceptGradient = 0;

        points.forEach(p => {
            const prediction = slope * p.x + intercept;
            const error = prediction - p.y;
            slopeGradient += error * p.x;
            interceptGradient += error;
        });

        slopeGradient = (2 / n) * slopeGradient;
        interceptGradient = (2 / n) * interceptGradient;

        // Update parameters
        slope = slope - learningRate * slopeGradient;
        intercept = intercept - learningRate * interceptGradient;

        // Calculate loss for this epoch
        const mse = calculateMSE(points, slope, intercept);

        history.push({
            epoch: i + 1,
            slope,
            intercept,
            loss: mse,
            slopeGradient,
            interceptGradient,
        });

        // Early stopping if loss becomes NaN (divergence)
        if (!isFinite(mse)) {
            break;
        }
    }

    return {
        finalSlope: slope,
        finalIntercept: intercept,
        history,
        converged: history.length > 0 && isFinite(history[history.length - 1].loss),
    };
};

/**
 * Normal Equation solution (closed-form)
 * θ = (X^T X)^(-1) X^T y
 * For simple linear regression: solves exactly without iteration
 * @param {Array} points - Array of {x, y} objects
 * @returns {Object} slope and intercept
 */
export const normalEquation = (points) => {
    // This is mathematically equivalent to least squares for simple regression
    return calculateLinearRegression(points);
};

/**
 * Generate cost surface data for visualization
 * @param {Array} points - Training data
 * @param {Array} slopeRange - [min, max] for slope
 * @param {Array} interceptRange - [min, max] for intercept
 * @param {number} resolution - Grid resolution
 * @returns {Object} Surface data for 3D plotting
 */
export const generateCostSurface = (
    points,
    slopeRange = [-2, 2],
    interceptRange = [-5, 5],
    resolution = 30
) => {
    const slopeStep = (slopeRange[1] - slopeRange[0]) / resolution;
    const interceptStep = (interceptRange[1] - interceptRange[0]) / resolution;

    const slopes = [];
    const intercepts = [];
    const costs = [];

    for (let i = 0; i <= resolution; i++) {
        const slopeRow = [];
        const interceptRow = [];
        const costRow = [];

        for (let j = 0; j <= resolution; j++) {
            const s = slopeRange[0] + i * slopeStep;
            const b = interceptRange[0] + j * interceptStep;

            slopeRow.push(s);
            interceptRow.push(b);
            costRow.push(calculateMSE(points, s, b));
        }

        slopes.push(slopeRow);
        intercepts.push(interceptRow);
        costs.push(costRow);
    }

    return { slopes, intercepts, costs };
};

/**
 * Detect outliers using IQR method
 * Points with residuals beyond 1.5*IQR are considered outliers
 * @param {Array} points - Array of {x, y} objects
 * @param {number} slope - Regression line slope
 * @param {number} intercept - Regression line intercept
 * @returns {Array} Array of indices that are outliers
 */
export const detectOutliers = (points, slope, intercept) => {
    if (points.length < 4) return [];

    // Calculate residuals
    const residuals = points.map((p, i) => ({
        index: i,
        residual: Math.abs(p.y - (slope * p.x + intercept)),
    }));

    // Sort residuals
    const sorted = [...residuals].sort((a, b) => a.residual - b.residual);

    // Calculate Q1, Q3, IQR
    const q1Index = Math.floor(sorted.length * 0.25);
    const q3Index = Math.floor(sorted.length * 0.75);

    const q1 = sorted[q1Index].residual;
    const q3 = sorted[q3Index].residual;
    const iqr = q3 - q1;

    const threshold = q3 + 1.5 * iqr;

    return residuals
        .filter(r => r.residual > threshold)
        .map(r => r.index);
};

/**
 * Apply L2 (Ridge) regularization penalty to cost
 * @param {number} baseCost - Original cost (MSE)
 * @param {number} slope - Current slope
 * @param {number} lambda - Regularization strength
 * @returns {number} Regularized cost
 */
export const ridgeRegularization = (baseCost, slope, lambda = 0.1) => {
    return baseCost + lambda * (slope ** 2);
};

/**
 * Apply L1 (Lasso) regularization penalty to cost
 * @param {number} baseCost - Original cost (MSE)
 * @param {number} slope - Current slope
 * @param {number} lambda - Regularization strength
 * @returns {number} Regularized cost
 */
export const lassoRegularization = (baseCost, slope, lambda = 0.1) => {
    return baseCost + lambda * Math.abs(slope);
};

/**
 * Generate sample datasets for teaching
 * @param {string} type - Dataset type
 * @param {number} n - Number of points
 * @returns {Array} Generated points
 */
export const generateSampleDataset = (type = 'linear', n = 20) => {
    const points = [];

    switch (type) {
        case 'linear':
            // Clean linear relationship
            for (let i = 0; i < n; i++) {
                const x = (i / n) * 10;
                const y = 2 * x + 3 + (Math.random() - 0.5) * 2;
                points.push({ x, y });
            }
            break;

        case 'noisy':
            // Linear with high noise
            for (let i = 0; i < n; i++) {
                const x = (i / n) * 10;
                const y = 1.5 * x + 5 + (Math.random() - 0.5) * 8;
                points.push({ x, y });
            }
            break;

        case 'outliers':
            // Linear with outliers
            for (let i = 0; i < n; i++) {
                const x = (i / n) * 10;
                let y = 2 * x + 3 + (Math.random() - 0.5) * 2;
                // Add outliers
                if (i === 5 || i === 15) {
                    y += (Math.random() > 0.5 ? 1 : -1) * 15;
                }
                points.push({ x, y });
            }
            break;

        case 'random':
            // Random scatter (no correlation)
            for (let i = 0; i < n; i++) {
                const x = Math.random() * 10;
                const y = Math.random() * 20;
                points.push({ x, y });
            }
            break;

        default:
            return generateSampleDataset('linear', n);
    }

    return points;
};

/**
 * Format number for display
 * @param {number} value - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (value, decimals = 4) => {
    if (typeof value !== 'number' || !isFinite(value)) return '—';
    return value.toFixed(decimals);
};
