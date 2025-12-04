import React from 'react';

/**
 * Reusable Loading Spinner Component
 * @param {string} size - Size of spinner: 'small', 'medium', 'large' (default: 'medium')
 * @param {string} color - Color of spinner (default: '#0056b3')
 * @param {string} message - Optional loading message to display
 */
const LoadingSpinner = ({ size = 'medium', color = '#0056b3', message = '' }) => {
    const sizeMap = {
        small: 20,
        medium: 40,
        large: 60
    };

    const spinnerSize = sizeMap[size] || sizeMap.medium;

    const spinnerStyle = {
        display: 'inline-block',
        width: `${spinnerSize}px`,
        height: `${spinnerSize}px`,
        border: `${Math.max(2, spinnerSize / 10)}px solid rgba(0, 0, 0, 0.1)`,
        borderTop: `${Math.max(2, spinnerSize / 10)}px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '20px'
    };

    const messageStyle = {
        color: '#666',
        fontSize: '14px',
        fontWeight: '500'
    };

    return (
        <div style={containerStyle}>
            <div style={spinnerStyle}></div>
            {message && <div style={messageStyle}>{message}</div>}
            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
};

export default LoadingSpinner;
