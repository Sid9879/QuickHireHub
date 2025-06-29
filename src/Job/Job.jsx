import React, { useState, useEffect, useRef, useCallback } from 'react'; // Import useRef and useCallback
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    MapPin,
    IndianRupee,
    Calendar,
    Clipboard,
    Lightbulb,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Search,
    SlidersHorizontal
} from 'lucide-react';
import { useSelector } from 'react-redux';

const Job = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(9);
    const [totalPages, setTotalPages] = useState(1);

   
    const [filterSkill, setFilterSkill] = useState('');
    const [filterTitle, setFilterTitle] = useState('');

    
    const [debouncedFilterSkill, setDebouncedFilterSkill] = useState('');
    const [debouncedFilterTitle, setDebouncedFilterTitle] = useState('');

   
    const [isFilterActive, setIsFilterActive] = useState(false);
    
  
    
    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
        setIsFilterActive(debouncedFilterSkill.trim() !== '' || debouncedFilterTitle.trim() !== '');
    }, [debouncedFilterSkill, debouncedFilterTitle]);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.append('page', currentPage);
            params.append('limit', jobsPerPage);

            
            if (debouncedFilterSkill.trim()) {
                params.append('skills', debouncedFilterSkill.toLowerCase().trim());
            }
            if (debouncedFilterTitle.trim()) {
                params.append('title', debouncedFilterTitle.toLowerCase().trim());
            }

            const apiUrl = `https://freelancing-backend-z0fy.onrender.com/api/jobs/filter?${params.toString()}`;

            const response = await axios.get(apiUrl, {
                withCredentials: true,
            });

            if (response.status >= 200 && response.status < 300) {
                setJobs(response.data.jobs);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.currentPage);
                setError(null);
            } else {
                setError(`Failed to fetch jobs: Server responded with status ${response.status}.`);
                console.error('Failed to fetch jobs:', response.status, response.data);
                setJobs([]);
                setTotalPages(1);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    setError(`Error: ${err.response.data?.message || err.response.statusText}`);
                    console.error('Error fetching jobs (Axios error response):', err.response.status, err.response.data);
                } else if (err.request) {
                    setError('Network error: No response received from server.');
                    console.error('Error fetching jobs (Axios error request):', err.request);
                } else {
                    setError(`An unexpected error occurred: ${err.message}`);
                    console.error('Error setting up request (Axios error):', err.message);
                }
            } else {
                setError(`An unexpected error occurred: ${err.message}`);
                console.error('General error during job fetch:', err);
            }
            setJobs([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [currentPage, jobsPerPage, debouncedFilterSkill, debouncedFilterTitle]);

   
    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]); 


    const handleApply = async (jobId) => {
        const check = window.confirm("Are you sure you want to apply for this job?");
        if (!check) {
            return;
        }

        try {
            const apiUrl = `https://freelancing-backend-z0fy.onrender.com/api/jobs/apply/${jobId}`;
            const response = await axios.post(apiUrl, {}, {
                withCredentials: true,
            });
            if (response.data) {
                toast.success(response.data.message || "Successfully applied for the job!", {
                    position: "top-center",
                });
            }
        } catch (error) {
            toast.error(error.response.data?.message || "Failed to apply for the job.", {
                position: "top-center",
            });
        }
    };

   
    const handleSkillChange = (e) => {
        const value = e.target.value;
        setFilterSkill(value); 

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            setDebouncedFilterSkill(value); 
            setCurrentPage(1); 
        }, 1000);
    };

   
    const handleTitleChange = (e) => {
        const value = e.target.value;
        setFilterTitle(value); 

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            setDebouncedFilterTitle(value);
            setCurrentPage(1); 
        }, 1000);
    };

   
    const handleSearchClick = () => {
        
        setDebouncedFilterSkill(filterSkill);
        setDebouncedFilterTitle(filterTitle);
        setCurrentPage(1); // Reset page to 1
    };


    const handleClearFilters = () => {
        setFilterSkill(''); 
        setFilterTitle('');
        setDebouncedFilterSkill(''); 
        setDebouncedFilterTitle('');
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPaginationButtons = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (startPage === 1 && endPage < totalPages) {
            endPage = Math.min(totalPages, 5);
        }
        if (endPage === totalPages && startPage > 1) {
            startPage = Math.max(1, totalPages - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        currentPage === i
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4 font-sans text-white text-xl">
                <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading projects listings...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4 font-sans text-white text-xl">
                <p className="text-red-300 mb-4">Error loading projects:</p>
                <p className="text-red-200 text-lg text-center">{error}</p>
                <p className="mt-4 text-sm text-gray-200">Please ensure your internet connection.</p>
            </div>
        );
    }


    if (jobs.length === 0 && !isFilterActive) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4 font-sans text-white text-xl">
                No projects listings found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4 sm:p-6 lg:p-8 font-sans ">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 text-center leading-tight mt-8">
                Open Freelance Opportunities
            </h1>

            {/* Filter Inputs */}
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Filter by skill (e.g., React, Node.js)"
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={filterSkill} 
                        onChange={handleSkillChange} 
                    />
                    <input
                        type="text"
                        placeholder="Filter by job title (e.g., Web Developer)"
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={filterTitle} 
                        onChange={handleTitleChange} 
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSearchClick}
                            className="flex-1 flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
                        >
                            <Search className="w-5 h-5 mr-2" /> Search
                        </button>
                        {isFilterActive && ( 
                            <button
                                onClick={handleClearFilters}
                                className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition duration-200"
                            >
                                <SlidersHorizontal className="w-5 h-5 mr-2" /> Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* No jobs found with active filters message */}
            {jobs.length === 0 && isFilterActive && (
                <div className="text-center text-xl mt-12 text-white">
                    No jobs found matching your filter criteria. Try adjusting your search or clear filters.
                </div>
            )}

            {/* Job Listings Grid */}
            {jobs.length > 0 && ( 
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
                    {jobs.map((job) => (
                        <div
                            key={job._id}
                            className="bg-white rounded-xl shadow-lg p-6 flex flex-col transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Title:{job.title}</h2>

                            {job.client && job.client.name && (
                                <p className="text-gray-500 text-sm mb-2">Posted by: {job.client.name}</p>
                            )}
                            <p className="text-gray-600 flex items-center mb-1">
                                <MapPin className="w-4 h-4 mr-2 text-indigo-500" /> {job.city}
                            </p>
                            <p className="text-gray-600 flex items-center mb-4">
                                <IndianRupee className="w-4 h-4 mr-2 text-green-600" /> Budget: INR {job.budget?.toLocaleString('en-IN')}
                            </p>

                            <div className="text-gray-700 text-sm flex items-center mb-4 leading-relaxed line-clamp-3">
                                <Clipboard className="w-4 h-4 mr-2 text-purple-500" /> {job.description.slice(0, 40)}...
                            </div>
                            <div className="text-gray-600 flex items-center mb-4">
                                <Calendar className="w-4 h-4 mr-2 text-blue-600" /> Posted on: {new Date(job.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-600 text-sm mb-4">
                                <Calendar className="w-4 h-4 mr-2 text-red-500" /> Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
                            </div>

                            {job.skillsRequired && job.skillsRequired.length > 0 && (
                                <div className="mb-4">
                                    <span className="block text-gray-700 font-medium text-sm mb-2 flex items-center">
                                        <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" /> Skills:
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
                                </div>
                            )}

                            <div className='flex flex-col md:flex-row justify-center items-center gap-4'>
                                <button
                                    onClick={() => handleApply(job._id)}
                                    className="mt-auto flex items-center justify-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 text-base group"
                                >
                                    Apply Now
                                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                                </button>
                                <Link to='/details' state={job}
                                    className="mt-auto flex items-center justify-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 text-base group"
                                >
                                    View Now
                                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && jobs.length > 0 && ( // 
                <div className="flex justify-center items-center space-x-2 mt-8 text-white">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {renderPaginationButtons()}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Job;