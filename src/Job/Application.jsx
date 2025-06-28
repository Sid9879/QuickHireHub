import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Calendar,
  Info, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Lightbulb
} from 'lucide-react';

const Application = () => {
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const fetchMyApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = 'https://freelancing-backend-z0fy.onrender.com/api/jobs/applied_jobs';
      const response = await axios.get(apiUrl, {
        withCredentials: true,
      });


      if (response.status >= 200 && response.status < 300) {
        setMyApplications(response.data.appliedJobs|| []);
      } else {
        setError(`Failed to fetch applications: Server responded with status ${response.status}`);
        console.error('Failed to fetch applications:', response.status, response.data);
        setMyApplications(response.data.appliedJobs);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setMyApplications(response.data.appliedJobs);
      setError(null);
    } catch (err) {
      console.error('An error occurred during mock data loading:', err);
      setError('An error occurred while displaying mock data.');
      setMyApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);


  const handleRemoveApplication = async (applicationId) => {
   
    const apiUrl = `https://freelancing-backend-z0fy.onrender.com/api/jobs/job_applied/${applicationId}`;
    const response = await axios.delete(apiUrl, {
      withCredentials: true,
    });
    if (response.status >= 200 && response.status < 300) {
      fetchMyApplications()
      console.log(`Application ${applicationId} removed successfully:`, response.data);
    }
  };


  
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="flex items-center text-yellow-600"><Clock className="w-4 h-4 mr-1" />Pending</span>;
      case 'Accepted':
        return <span className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1" />Approved</span>;
      case 'Rejected':
        return <span className="flex items-center text-red-600"><XCircle className="w-4 h-4 mr-1" />Rejected</span>;
      default:
        return <span className="flex items-center text-gray-600"><Info className="w-4 h-4 mr-1" />{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4 font-sans text-white text-xl">
        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading your applications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4 font-sans text-white text-xl">
        <p className="text-red-300 mb-4">Error loading applications:</p>
      </div>
    );
  }

  if (myApplications.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4 font-sans text-white text-xl">
        You have no applications yet. Start applying to projects to see them here!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4 sm:p-6 lg:p-8 font-sans">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 text-center leading-tight mt-9">
        Your Applications
      </h1>

      <div className="grid grid-cols-1  gap-6 max-w-4xl mx-auto">
        {myApplications.map((app) => (
          <div
            key={app._id}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{app?.title}</h2>
            <p className="text-gray-600 flex items-center mb-1">
              <MapPin className="w-4 h-4 mr-2 text-indigo-500" /> {app?.city}
            </p>
            <p className="text-gray-600 flex items-center mb-4">
              <IndianRupee className="w-4 h-4 mr-2 text-green-600" /> Budget: INR {app?.budget?.toLocaleString('en-IN')}
            </p>

            <div className="text-gray-700 text-sm flex items-center mb-2 leading-relaxed line-clamp-3">
              <Briefcase className="w-4 h-4 mr-2 text-purple-500" /> Job Description: {app?.description || 'No description available.'}
            </div>

            <div className="flex items-center text-gray-600 text-sm mb-2">
              <Calendar className="w-4 h-4 mr-2 text-red-500" /> Applied On: {new Date(app.appliedAt).toLocaleDateString()}
            </div>

             <div className="flex items-center text-gray-600 text-sm mb-2">
              <Calendar className="w-4 h-4 mr-2 text-red-500" /> Deadline: {new Date(app.deadline).toLocaleDateString()}
            </div>

            <div className="flex items-center text-gray-700 font-semibold text-sm mb-4">
              {getStatusDisplay(app?.status)}
            </div>

            {app?.skillsRequired && app?.skillsRequired?.length > 0 && (
              <div className="mb-4 flex">
                <span className=" text-gray-700 font-medium text-sm mb-2 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" /> Skills:
                </span>
                <div className="flex flex-wrap gap-2">
                  {app?.skillsRequired.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-0.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
              <button
                onClick={() => handleRemoveApplication(app._id)}
                className="flex items-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition duration-200 text-sm group"
              >
                <Trash2 className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:scale-110" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Application;
