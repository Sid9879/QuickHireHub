import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const response = axios.post(`https://freelancing-backend-z0fy.onrender.com/api/auth/contact`, formData);
      if (response.status === 200) {
        toast.success('Message sent successfully!');
      }
      setSubmitted(true);
       setTimeout(() => {
        setSubmitted(false);
      }, 2000);
    
    } catch (error) {
      console.log(error);
      toast.error('Failed to send message. Please try again later.'||error.res.data.message);
    }
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6 myTheme">
      <div className="bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg max-w-xl w-full p-8 bg-red-200 mt-2">
        <h1 className="text-4xl font-extrabold mb-6 text-black text-center">Contact Us</h1>

        {submitted && (
          <div className="mb-6 p-4 bg-green-500 bg-opacity-80 rounded text-black text-center animate-fadeIn">
            Thank you for reaching out! We'll get back to you soon.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div>
            <label htmlFor="name" className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your name"
              className="w-full rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block mb-1 font-semibold">Subject</label>
            <input
              type="text"
              name="subject"
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-1 font-semibold">Message</label>
            <textarea
              name="message"
              id="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Write your message here..."
              className="w-full rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-700 hover:bg-indigo-800 transition duration-300 rounded-md py-3 font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-400"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
          .myTheme{
           background: linear-gradient(
  135deg,
  #e1b382,     
  #c89666,      
  #2d545e,     
  #12343b       
);
          }
      `}</style>
    </div>
  );
};

export default Contact;
