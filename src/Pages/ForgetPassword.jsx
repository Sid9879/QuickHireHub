import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Loader2, Info } from 'lucide-react';

const ForgetPassword = () => {
  const emailRef = useRef();
  const [isLoading, setIsLoading] = useState(false); 
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValue = emailRef.current.value;

    if (!emailValue) {
      toast.error("Please enter your email address.", { position: "top-center", theme: "dark" });
      return;
    }

    setIsLoading(true);
    setResetMessage('');

    try {
      const res = await axios.post('https://freelancing-backend-z0fy.onrender.com/api/users/resetPassword', { email: emailValue });
      const data = res.data;

      if (data.message) {
        toast.success(data.message, { position: "top-center", theme: "dark" });
        setResetMessage("If an account with that email exists, a password reset link has been sent to your inbox. Please check your email (and spam folder) for further instructions.");
      } else {
        toast.error("Failed to send reset link. Please try again.", { position: "top-center", theme: "dark" });
      }
    } catch (error) {
      console.error("Password reset request failed:", error);
      const errorMessage = error.response?.data?.message || "Failed to send reset link. Please try again.";
      toast.error(errorMessage, { position: "top-center", theme: "dark" });
      setResetMessage(''); 
    } finally {
      setIsLoading(false); 
      emailRef.current.value = ''; 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <main className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-7 border border-indigo-400">
          <div className="text-center mb-6">
            <h1 className="block text-3xl font-extrabold text-gray-900 mb-2">Forgot Password?</h1>
            <p className="mt-2 text-md text-gray-700">
              No worries, it happens! Enter your email and we'll send you a reset link.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Remember your password?{' '}
              <Link
                className="text-indigo-600 hover:text-indigo-800 decoration-2 hover:underline font-medium transition-colors duration-200"
                to="/login"
              >
                Login here
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold ml-1 mb-2 text-gray-800"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    name="email"
                    className="py-3 px-4 pl-10 block w-full border-2 border-gray-300 rounded-md text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition-all duration-200"
                    required
                    aria-describedby="email-error"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold transition-all text-sm
                  ${isLoading
                    ? 'bg-indigo-300 text-indigo-700 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                  }`}
                disabled={isLoading} 
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Sending...
                  </>
                ) : (
                  'Reset password'
                )}
              </button>
            </div>
          </form>

          {resetMessage && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg flex items-start gap-3 shadow-md">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                {resetMessage}
              </p>
            </div>
          )}

        </div>

        {/* Removed the extra "Contact us" and "Didn't receive..." sections outside the main card
            to keep the layout clean and messages integrated. */}
      </main>
    </div>
  );
};

export default ForgetPassword;