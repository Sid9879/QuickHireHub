import React, { useState, useRef, useEffect } from 'react';
import { Menu, X} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { logOutUser } from '../store/userSlice';
import { persistStore } from 'redux-persist';
import  store  from '../store/store';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import logo from '../assets/logo.png'


const persistor = persistStore(store);
const Navbar = () => {
  let navigate = useNavigate();
  const { user, login } = useSelector((state) => state.user);
  let dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoutUser =async()=>{
   try {
     const res = await axios.post(`https://freelancing-backend-z0fy.onrender.com/api/auth/logout`,{},{
      withCredentials:true
    })
    if (res.data.success) {
        toast.success(res.data.message || "Logout Successfully");
          await persistor.purge();
           navigate('/login');
  dispatch(logOutUser());
      }
   } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Logout failed. Please try again.");
    
   }
  }

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg fixed w-full mb-10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight">QuickHireHub</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {login && user?.role==="client"&&(<Link to="/createjob" className="hover:text-yellow-300 transition duration-300">Post Project</Link>)}
         {login&&<Link to="/" className="hover:text-yellow-300 transition duration-300">Home</Link>}
          <Link to="/about" className="hover:text-yellow-300 transition duration-300">About</Link>
         { !login&&<Link to="/signup" className="hover:text-yellow-300 transition duration-300">Signup</Link>}
          {!login&&(<Link to="/login" className="hover:text-yellow-300 transition duration-300">Login</Link>)}
          <Link to="/contact" className="hover:text-yellow-300 transition duration-300">Contact</Link>
       {/* {login && (user?.role === "freelancer") && (
  <Link to="/freelancer/manage-projects" className="hover:text-yellow-300 transition duration-300">
    Manage Projects
  </Link>
)} */}


          
        


          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 hover:text-yellow-300 transition cursor-pointer"
            >
              <img
                src={user.profilePicture||logo}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-4 bg-white text-gray-800 rounded shadow-lg w-48 animate-fadeIn z-50">
                {
  login && user.role === 'freelancer' ? (
    <Link to='/yourDashboard' className='block px-4 py-2 hover:bg-gray-100'>Dashboard</Link>
  ) : login && user.role === 'client' && (
    <Link to='/Client/Dashboard' className='block px-4 py-2 hover:bg-gray-100'>Dashboard</Link>
  )
}
{/* { login===true&& <Link to="/login" onClick={logoutUser} className="block px-4 py-2 hover:bg-gray-100">Logout</Link>} */}
{login ? (
  <button
    onClick={logoutUser}
    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
  >
    Logout
  </button>
) : (
  <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">
    Login
  </Link>
)}


          {login && (user?.role === "freelancer") && (
  <Link to="/freelancer/manage-projects" className="block px-4 py-2 hover:bg-gray-100">
    Manage Projects
  </Link>
)}

              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 animate-slideDown bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
         {
  login && user.role === 'freelancer' ? (
    <Link to='/yourDashboard' className='block hover:text-yellow-300'>Dashboard</Link>
  ) : login && user.role === 'client' && (
    <Link to='/Client/Dashboard' className='block hover:text-yellow-300'>Dashboard</Link>
  )
}
          {login && user?.role==="client"&&(<Link to="/createjob" className="block hover:text-yellow-300">Post Project</Link>)}

          <Link to="/" className="block hover:text-yellow-300">Home</Link>
          <Link to="/about" className="block hover:text-yellow-300">About</Link>
          {/* <Link to="#" className="block hover:text-yellow-300">Services</Link> */}
          <Link to="/contact" className="block hover:text-yellow-300">Contact</Link>
          {/* <Link to="/profile" className="block hover:text-yellow-300">Profile</Link> */}
        {login && (
  <button
    onClick={logoutUser}
    className="block w-full text-left hover:text-yellow-300"
  >
    Logout
  </button>
)}

          {login && (user?.role === "freelancer") && (
  <Link to="/freelancer/manage-projects" className="hover:text-yellow-300">
    Manage Projects
  </Link>
)}

        </div>
      )}

      {/* Tailwind keyframe animation styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slideDown {
            animation: slideDown 0.3s ease forwards;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
