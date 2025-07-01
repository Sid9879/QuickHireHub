import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../store/userSlice";
import axios from "axios";
import { persistStore } from 'redux-persist';
import store from "../store/store";


const persistor = persistStore(store);

const ProtectedRoute = ({ children, role = null }) => {
   const dispatch = useDispatch();
     const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const { login, user } = useSelector((state) => state.user);
useEffect(() => {
  const checkToken = async () => {
    try {
      await axios.get("https://freelancing-backend-z0fy.onrender.com/api/auth/check", {
        withCredentials: true,
      });
      setIsValid(true);
    } catch (error) {
      await persistor.purge();
      dispatch(logOutUser());
      setIsValid(false);
    } finally {
      setIsChecking(false);
    }
  };

  checkToken();
}, [dispatch]);


  if (isChecking) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4 font-sans text-white text-xl">
      <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Checking authentication...
    </div>
  );
}


  if (!isValid) return <Navigate to="/login" />;
  if (!login) return <Navigate to="/login" />;


  if (role && user?.role !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
