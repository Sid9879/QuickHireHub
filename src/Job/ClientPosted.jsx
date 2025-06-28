import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import {Link} from 'react-router-dom'
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Calendar,
  Info,
  User,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  RefreshCcw,
  Loader2, 
  Eye
} from 'lucide-react';


const ClientPosted = () => {
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatusFor, setUpdatingStatusFor] = useState(null);

  
  
  const fetchPostedJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = 'https://freelancing-backend-z0fy.onrender.com/api/jobs/posted_jobs';
      const response = await axios.get(apiUrl, {
        withCredentials: true,
      });
      if (response.status >= 200 && response.status < 300) {
        setPostedJobs(response.data|| []);
        setError(null);
      } else {
        setError(`Failed to fetch posted jobs: Server responded with status ${response.status}. Displaying mock data.`);
        console.error('Failed to fetch posted jobs:', response.status, response.data);
        setPostedJobs(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(`Error: ${err.response.data?.message || err.response.statusText}`);
          console.error('Error fetching posted jobs (Axios error response):', err.response.status, err.response.data);
        } else if (err.request) {
          setError('Network error: No response received from server. Please ensure your backend server is running and accessible.');
          console.error('Error fetching posted jobs (Axios error request):', err.request);
        } else {
          setError(`An unexpected error occurred: ${err.message}`);
          console.error('Error setting up request (Axios error):', err.message);
        }
      } else {
        setError(`An unexpected error occurred: ${err.message}`);
        console.error('General error during job fetch:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostedJobs();
  }, []);

  const handleUpdateStatus = async (applicationId, newStatus, applicantId) => {
    setUpdatingStatusFor({ appId: applicationId, newStatus });
    // console.log(`Updating status for application ${applicationId} to ${newStatus} for applicant ${applicantId}`);
    try {
      const apiUrl = `https://freelancing-backend-z0fy.onrender.com/api/jobs/update_application/${applicationId}/${applicantId}`; // 
      const response = await axios.patch(apiUrl, { status:newStatus }, {
        withCredentials: true,
      });
        
        if(response.data.success){
          fetchPostedJobs()
          toast.success(`Application status updated to ${newStatus}.`);
        }
    } catch (error) {
      toast.error(`Failed to update status: ${error.response?.data?.message || 'An unknown error occurred.'}`);
      console.error("Error updating status:", error.response);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error updating status:", error.response.status, error.response.data);
        if (error.response.status === 401) {
          setError(`Unauthorized: ${error.response.data.message || 'Please log in again.'}`);
          // Consider clearing token and redirecting to login here
        } else {
          setError(`Status update failed: ${error.response.data.message || 'An unknown error occurred.'}`);
        }
      } else {
        console.error("An unexpected error occurred during status update:", error.message);
        setError(`An error occurred: ${error.message}.`);
      }
    } finally {
      setUpdatingStatusFor(null); 
    }
  };

  const handleRemove = async(jobId)=>{
    // console.log(`Removing job ${jobId}`);
    try {
      const apiUrl = `https://freelancing-backend-z0fy.onrender.com/api/jobs/removejob/${jobId}`;
    const response = await axios.delete(apiUrl,{
      withCredentials: true,
    })
      if(response.data.success){
        fetchPostedJobs()
        toast.success('Job removed successfully.',{theme: 'colored',position:'top-center'});
        };
    } catch(error) {
      console.error("Error removing job:", error);
      toast.error(`Failed to remove job: ${error.response?.data?.message || 'An unknown error occurred.'}`,{theme: 'colored',position:'top-center'});
    }
  }
  // Helper to get status icon and color
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="flex items-center text-yellow-600 font-semibold"><Clock className="w-4 h-4 mr-1" />Pending</span>;
      case 'Accepted':
        return <span className="flex items-center text-green-600 font-semibold"><CheckCircle className="w-4 h-4 mr-1" />Accepted</span>;
      case 'Rejected':
        return <span className="flex items-center text-red-600 font-semibold"><XCircle className="w-4 h-4 mr-1" />Rejected</span>;
      default:
        return <span className="flex items-center text-gray-600 font-semibold"><Info className="w-4 h-4 mr-1" />{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4 font-sans text-white text-xl">
        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading your posted jobs and applications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4 font-sans text-white text-xl">
        <p className="text-red-300 mb-4">Error loading data:</p>
        <p className="text-red-200 text-lg text-center">{error}</p>
        <p className="mt-4 text-sm text-gray-200">Please check your network or backend server..</p>
        <button
          onClick={fetchPostedJobs}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200"
        >
          <RefreshCcw className="inline-block w-4 h-4 mr-2" /> Try Again
        </button>
      </div>
    );
  }

  if (postedJobs.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4 font-sans text-white text-xl">
        You have not posted any project yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4 sm:p-6 lg:p-8 font-sans">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 text-center leading-tight mt-10">
        My Posted Projects & Applications
      </h1>

      <div className="space-y-8 max-w-6xl mx-auto">
        {postedJobs.map((job) => (
          <div key={job._id} className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
            {/* Left Side: Job Details */}
            <div className="p-6 lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h2>
              <p className="text-gray-600 flex items-center mb-1">
                <MapPin className="w-4 h-4 mr-2 text-indigo-500" /> {job.city}
              </p>
              <p className="text-gray-600 flex items-center mb-4">
                <IndianRupee className="w-4 h-4 mr-2 text-green-600" /> Budget: INR {job.budget?.toLocaleString('en-IN')}
              </p>

              <div className="text-gray-700 text-sm flex items-center mb-4 leading-relaxed line-clamp-4">
                <Briefcase className="w-4 h-4 mr-2 text-purple-500" /> Description: {job.description}
              </div>
               <div className="flex items-center text-gray-600 text-sm mb-4">
                <Calendar className="w-4 h-4 mr-2 text-green-400" /> Posted On: {job.createdAt ? new Date(job.createdAt).toLocaleDateString("en-GB") : 'N/A'}
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-4">
                <Calendar className="w-4 h-4 mr-2 text-red-500" /> Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString("en-GB") : 'N/A'}
              </div>

              {job.skillsRequired && job.skillsRequired.length > 0 && (
                <div className="mb-4">
                  <span className=" text-gray-700 font-medium text-sm mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2 text-yellow-600" /> Skills Required:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      >
                        {skill}
                      </span>
                      
                    ))}
                  </div>
                  <button onClick={()=>handleRemove(job._id)} className='text-red-500 font-semibold border-red-200 border-2 bg-red-300 w-36 h-10 rounded-xl mt-5 cursor-pointer'>Remove Project</button>
                </div>
              )}
            </div>

            {/* Right Side: Applicants List */}
            <div className="p-6 lg:w-1/2 flex flex-col">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600" /> Applicants ({job.applicants.length})
              </h3>

              {job.applicants.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No applications for this job yet.</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {job.applicants.map((applicant) => (
                    <div
                      key={applicant._id}
                      className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex-grow mb-2 sm:mb-0">
                        <p className="text-gray-800 font-semibold flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-600" /> {applicant.freelancer?.name || 'N/A'}
                        </p>
                        <p className="text-gray-600 text-sm flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" /> {applicant.freelancer?.email || 'N/A'}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Applied On: {new Date(applicant.appliedAt).toLocaleDateString()}
                        </p>
                        <Link state={applicant?.freelancer?._id} to ='/UserProfile' className="flex items-center gap-2 mt-1">
                        <Eye className="w-5 h-5" />
                            View Profile
                        </Link>

                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusDisplay(applicant.status)}

                        {/* Status Update Dropdown */}
                        <div className="relative inline-block text-left">
                          <select
                            value={applicant.status}
                            onChange={(e) => handleUpdateStatus(job._id, e.target.value, applicant?.freelancer?._id)}
                            disabled={updatingStatusFor && updatingStatusFor.appId === applicant._id}
                            className="appearance-none bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            {updatingStatusFor && updatingStatusFor.appId === applicant._id ? (
                                <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientPosted;
