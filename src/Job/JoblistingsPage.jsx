import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import {
  Briefcase,
  MapPin,
  IndianRupee,
  Calendar,
  Clipboard,
  Lightbulb,
  PlusCircle,
  XCircle
} from 'lucide-react';


const JoblistingsPage = () => {
 
  const [jobData, setJobData] = useState({
    title: '',
    city: '',
    budget: '',
    deadline: '',
    description: '',
    skillsRequired: [],
    skillInput: ''
  });


  const [formMessage, setFormMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    if (jobData.skillInput.trim() !== '') {
      setJobData((prevData) => ({
        ...prevData,
        skillsRequired: [...prevData.skillsRequired, prevData.skillInput.trim()],
        skillInput: '',
      }));
    }
  };

  const handleRemoveSkill = (index) => {
    setJobData((prevData) => ({
      ...prevData,
      skillsRequired: prevData.skillsRequired.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!jobData.title || !jobData.city || !jobData.budget || !jobData.deadline || !jobData.description || jobData.skillsRequired.length === 0) {
      setFormMessage('Please fill in all fields and add at least one skill.');
      setMessageType('error');
      setIsSubmitting(false);
      return;
    }

    try {
     const response = await axios.post(`https://freelancing-backend-z0fy.onrender.com/api/jobs/create`,jobData,{
      withCredentials: true,
     })
      if (response.status >= 200 && response.status < 300) {
                 toast.success(response.data.message,{position:"top-center",theme:"dark"})
        
        setFormMessage('Job posted successfully!');
setTimeout(() => {
    setFormMessage('');
}, 2000);
        setMessageType('success');
        setJobData({
          title: '',
          city: '',
          budget: '',
          deadline: '',
          description: '',
          skillsRequired: [],
          skillInput: ''
        });
      } else {
        console.error('Failed to post job:', response.status, response.data);
        setFormMessage(`Failed to post job: ${response.data.message || 'Server error'}`);
        setMessageType('error');
      }
    } catch (error) {
             toast.error(error.response?.data?.error || error.response?.data?.message || "Login failed",{position:"top-center",theme:"dark"})
      
      if (error.response) {
        console.error('Failed to post job (Axios error response):', error.response.status, error.response.data);
        setFormMessage(`Failed to post job: ${error.response.data?.message || 'Server error'}`);
      } else if (error.request) {
        console.error('No response received (Axios error request):', error.request);
        setFormMessage('No response from server. Please check your network or server status.');
      } else {
        console.error('Error setting up request (Axios error):', error.message);
        setFormMessage(`An unexpected error occurred: ${error.message}`);
      }
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10 w-full max-w-2xl transform mt-10 transition-all duration-300 hover:scale-[1.02]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 text-center leading-tight">
          Create New Project Listing
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium text-sm mb-2 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-indigo-500" /> Project Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={jobData.title}
              onChange={handleChange}
              placeholder="e.g.,Website"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition duration-200"
              required
            />
          </div>

          {/* City Field */}
          <div>
            <label htmlFor="city" className="block text-gray-700 font-medium text-sm mb-2 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-indigo-500" /> City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={jobData.city}
              onChange={handleChange}
              placeholder="e.g.,Mumbai"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition duration-200"
              required
            />
          </div>

          {/* Budget Field */}
          <div>
            <label htmlFor="budget" className="block text-gray-700 font-medium text-sm mb-2 flex items-center">
              <IndianRupee className="w-5 h-5 mr-2 text-indigo-500" /> Budget (INR)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={jobData.budget}
              onChange={handleChange}
              placeholder="e.g., ₹ 800000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition duration-200"
              min="0"
              required
            />
          </div>

          {/* Deadline Field */}
          <div>
            <label htmlFor="deadline" className="block text-gray-700 font-medium text-sm mb-2 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-500" /> Application Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={jobData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition duration-200"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium text-sm mb-2 flex items-center">
              <Clipboard className="w-5 h-5 mr-2 text-indigo-500" /> Job Description
            </label>
            <textarea
              id="description"
              name="description"
              value={jobData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe the project responsibilities, requirements, and company culture..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition duration-200 resize-y"
              required
            ></textarea>
          </div>

          {/* Skills Required Field */}
          <div>
            <label htmlFor="skillInput" className="block text-gray-700 font-medium text-sm mb-2 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-indigo-500" /> Skills Required
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <input
                type="text"
                id="skillInput"
                name="skillInput"
                value={jobData.skillInput}
                onChange={handleChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type a skill and press Enter or click Add"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition duration-200"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="flex items-center justify-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition duration-200 text-sm font-medium shadow-md cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 mr-1" /> Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {jobData.skillsRequired.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm transition-all duration-200 hover:bg-indigo-200 hover:shadow-md"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                    aria-label={`Remove ${skill}`}
                  >
                    <XCircle className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Form Message Display */}
          {formMessage && (
            <div
              className={`p-3 rounded-lg text-sm font-medium ${
                messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {formMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center pt-4 flex items-center justify-center">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-3 focus:ring-indigo-500 focus:ring-offset-2 transition transform duration-200 active:scale-95 text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting Job...
                </>
              ) : (
                'Post Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoblistingsPage;
