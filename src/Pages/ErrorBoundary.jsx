import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCcw, Home, LifeBuoy } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4 text-white font-sans text-center">
          <div className="mb-6">
            <span role="img" aria-label="error-icon" className="text-6xl sm:text-8xl animate-bounce-slow">
              🚨
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Something Went Wrong!
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-xl leading-relaxed">
            We're sorry, but an unexpected error occurred.
            Please try refreshing the page or navigating back to the homepage.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={this.handleRefresh}
              className="flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 text-lg group"
            >
              <RefreshCcw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" /> Refresh Page
            </button>
            <Link
              to="/"
              className="flex items-center justify-center px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 text-lg group"
            >
              <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> Go to Homepage
            </Link>
            <Link
              to="/contact"
              className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300 text-lg group"
            >
              <LifeBuoy className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> Contact Support
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-8 p-4 bg-gray-800 bg-opacity-70 rounded-lg text-left max-w-2xl overflow-auto text-sm">
              <h3 className="text-orange-300 font-bold mb-2">Error Details:</h3>
              <details className="mb-2">
                <summary className="cursor-pointer text-gray-300 hover:text-white">Expand Error Message</summary>
                <p className="text-red-300 whitespace-pre-wrap break-words">{this.state.error.toString()}</p>
              </details>
              <details>
                <summary className="cursor-pointer text-gray-300 hover:text-white">Expand Component Stack</summary>
                <pre className="text-gray-400 whitespace-pre-wrap break-words text-xs">{this.state.errorInfo.componentStack}</pre>
              </details>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;