import React, { useState, useEffect } from 'react';
import {Calendar, FlaskConical, Link } from 'lucide-react'; 
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Rate } from 'antd';
import { toast } from 'react-toastify';


const ViewUserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    // console.log(userProfile)
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
        const [value, setvalue] = useState(0);

    let location = useLocation();
   
    const userId = location.state;

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            const apiUrl = `https://freelancing-backend-z0fy.onrender.com/api/users/${userId}`;
            const response = await axios.get(apiUrl, {
                withCredentials: true,
            });
            setUserProfile(response.data.freelancer);
        } catch (err) {
            console.error("Failed to fetch user profile:", err);
            setError("Failed to load user profile. Please try again.");
            setUserProfile(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserProfile();
        } else {
            setLoading(false);
            setError("No user ID provided to view profile.");
        }
    }, [userId]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-700">Loading profile...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
    }

    if (!userProfile) {
        return <div className="min-h-screen flex items-center justify-center text-gray-700">No profile data available.</div>;
    }

    const completedProjects = userProfile.completedProjects || [];

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 ">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 lg:p-10 mb-8 mt-10">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                    <div className="flex-shrink-0 relative">
                        <img
                            src={userProfile.profilePicture || 'https://via.placeholder.com/150'}
                            alt={userProfile.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-md"
                        />
                    </div>
                    <div className="text-center md:text-left flex-grow">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{userProfile.name}</h1>
                        <p className="text-xl text-indigo-600 font-semibold mb-3">
                            {userProfile.role === 'freelancer' ? 'Freelancer' : 'Client'}
                            {userProfile.role === 'freelancer' && userProfile.skills && userProfile.skills.length > 0 && (
                                <span className="ml-2 text-gray-600 text-lg">
                                    - {userProfile.skills[0]} {userProfile.skills.length > 1 ? ` & ${userProfile.skills.length - 1} more` : ''}
                                </span>
                            )}
                        </p>
                        {userProfile.rating && userProfile.role === 'freelancer' && (
                            <div className="flex items-center justify-center md:justify-start mb-4 text-gray-700">
                               {userProfile?.avgRating && (
  <div className="flex items-center">
    <Rate allowHalf disabled defaultValue={userProfile.avgRating} />
    <span className="ml-2 text-yellow-600 font-semibold">
      {userProfile.avgRating.toFixed(1)}
    </span>
  </div>
)}
                            </div>
                        )}
                        {/* <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto md:mx-0">{userProfile.bio || 'No bio provided yet.'}</p> */}
                    </div>
                </div>

                {userProfile.role === 'freelancer' && userProfile.skills && userProfile.skills.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {userProfile.skills.map((skill, index) => (
                                <span key={index} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                 <li className="flex items-center">
              <strong>Rating:</strong> 
              <span className="ml-2 text-yellow-500 font-semibold flex items-center">
               {userProfile.avgRating.toFixed(1)} <span className="ml-1 text-xl"> <Rate
  value={value}
  onChange={async (val) => {
    // console.log("User rated:", val);
    setvalue(val);
    try {
      const apiUrl = `https://freelancing-backend-z0fy.onrender.com/api/users/rating/${userId}`;
      const response = await axios.put(apiUrl, { value: val }, {
        withCredentials: true,
      });
    //   console.log("Rating submitted:", response.data);
      if(response.data.success){
        fetchUserProfile();
         toast.success("Liked profile", {
        theme: 'dark',
        position: 'top-center',
      });
      }
     
    } catch (error) {
      console.error("Rating submission failed:", error);
      toast.error("Failed to submit rating", {
        theme: 'dark',
        position: 'top-center',
      });
    }
  }}
/>
;</span>
              </span>
            </li>
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                    <p className="text-gray-700"><strong>Email:</strong> {userProfile.email}</p>
                </div>
            </div>

            {/* --- */}
            <hr className="my-8" />
            {/* --- */}

<div>
                <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 lg:p-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Projects</h2>

                {userProfile.projects.length === 0 ? (
                    <div className="text-center py-10 text-gray-600">
                        <p className="text-lg">No projects to display yet.</p>
                        {/* {userProfile.role === 'freelancer' && (
                            <p className="mt-2">Start applying to projects to build your portfolio!</p>
                        )} */}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {userProfile.projects?.map((project) => (
                            <div key={project._id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                                <h3 className="text-2xl font-bold text-indigo-700 mb-2">{project.title}</h3>
                               
                                <p className="text-gray-600 mb-3 line-clamp-3">Description:{project.description}</p>

                                <div className="space-y-2 text-gray-700 text-sm mb-4">
                                   
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                                        <span>Completed Date: {project.completedDate ? new Date(project.completedDate).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Link size={20}></Link>
                                         <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                View Project
                            </a>
                                    </div>
                                    {project.technologiesUsed && project.technologiesUsed.length > 0 && (
                                        <div className="flex items-center">
                                            <FlaskConical className="w-4 h-4 text-orange-600 mr-2" />
                                            <span>technologiesUsed:</span>
                                            <div className="flex flex-wrap gap-1 ml-2">
                                                {project.technologiesUsed.map((skill, idx) => (
                                                    <span key={idx} className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
</div>

        </div>
    );
};

export default ViewUserProfile;