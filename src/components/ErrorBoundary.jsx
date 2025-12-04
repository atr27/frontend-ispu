import React from 'react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('Error caught by ErrorBoundary:', error, errorInfo);

        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // You can also log to an error reporting service here
        // Example: logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div style={styles.container}>
                    <div style={styles.card}>
                        <div style={styles.iconContainer}>
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#ff0000"
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>

                        <h2 style={styles.title}>Oops! Terjadi Kesalahan</h2>
                        <p style={styles.message}>
                            Maaf, ada yang tidak beres. Silakan coba muat ulang halaman atau hubungi administrator jika masalah berlanjut.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details style={styles.details}>
                                <summary style={styles.summary}>Detail Error (Development Mode)</summary>
                                <pre style={styles.errorText}>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <div style={styles.buttonContainer}>
                            <button
                                onClick={this.handleReset}
                                style={styles.button}
                            >
                                Coba Lagi
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                style={{ ...styles.button, ...styles.buttonSecondary }}
                            >
                                Kembali ke Beranda
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
    },
    iconContainer: {
        marginBottom: '24px'
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '16px'
    },
    message: {
        fontSize: '16px',
        color: '#666',
        lineHeight: '1.5',
        marginBottom: '24px'
    },
    details: {
        textAlign: 'left',
        marginTop: '24px',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#f8f8f8',
        borderRadius: '4px',
        border: '1px solid #ddd'
    },
    summary: {
        cursor: 'pointer',
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#555'
    },
    errorText: {
        fontSize: '12px',
        color: '#d32f2f',
        overflow: 'auto',
        maxHeight: '200px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
    },
    buttonContainer: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    button: {
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '500',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: '#0056b3',
        color: '#fff',
        transition: 'background-color 0.2s'
    },
    buttonSecondary: {
        backgroundColor: '#6c757d'
    }
};

export default ErrorBoundary;
