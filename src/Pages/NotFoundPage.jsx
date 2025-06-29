import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Mail } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4 text-white font-sans text-center">
      <div className="mb-6 animate-pulse-slow">
        <span role="img" aria-label="lost-in-space" className="text-6xl sm:text-8xl">🌌</span>
        <span className="block text-2xl sm:text-4xl font-extrabold mt-2">Oops! Lost in Space?</span>
      </div>

      <h1 className="text-8xl sm:text-9xl font-extrabold mb-4 drop-shadow-lg">404</h1>

      <p className="text-xl sm:text-2xl mb-8 max-w-xl leading-relaxed">
        Looks like the page you're looking for has ventured into uncharted territory.
        It might have been moved or doesn't exist.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link
          to="/"
          className="flex items-center justify-center px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 text-lg group"
        >
          <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> Go to Homepage
        </Link>
        <Link
          to="/jobs"
          className="flex items-center justify-center px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 text-lg group"
        >
          <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> Search Opportunities
        </Link>
        <Link
          to="/contact"
          className="flex items-center justify-center px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 text-lg group"
        >
          <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> Contact Support
        </Link>
      </div>

      <p className="text-gray-200 text-sm italic">
        "Perhaps you mistyped the address or followed an old link?"
      </p>
    </div>
  );
};

export default NotFoundPage;