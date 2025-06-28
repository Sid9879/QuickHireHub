import React from 'react';
import photo from '../assets/photo.avif';
import Job from '../Job/Job';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logovideo from '../assets/logovideo.mp4'

const LandingPage = () => {
  const {login} = useSelector((state)=>state.user)
  if(login){
    return <Job/>
  }
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 mybg ">
      {/* Container */}
      <div className="max-w-6xl w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-12 py-10 mt-7">
        
        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Empower Your Work. Anywhere, Anytime.
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Join a network of skilled freelancers and forward-thinking clients from Tier 2/3 cities.
            Find work, hire talent, and grow — all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to = '/login' className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition cursor-pointer">
              Find Opportunities
            </Link>
            <Link to = '/login' className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition cursor-pointer">
              Post a Job
            </Link>
          </div>
        </div>
 
        <div className="flex-1">
            
          <video  autoPlay muted loop className="w-full h-auto rounded-xl shadow-lg "  src={logovideo}></video>
          {/* <img
            src={logovideo}
            alt="Freelancing"
          /> */}
        </div>
      </div>

      <footer className="w-full text-center py-4 text-gray-600 border-t mt-16 mytheme">
        &copy; 2025 Freelancer Marketplace | support@QuickHireHub.com | +91-9876543210
      </footer>

      <style>
        {
            `
            .mytheme {
            background-image: linear-gradient(to right top, #d16ba5, #d66fb0, #db74bc, #df79c8, #e27ed5, #c193ef, #9ca5fd, #78b4ff, #00ccff, #00e1fe, #00f1d5, #5ffb9e);
            }
       .mybg {
  background: linear-gradient(135deg, #fbe3e8 0%, #5cbdb9 50%, #ebf6f5 100%);
}



            `
        }
      </style>
    </div>
   
  );
};

export default LandingPage;


