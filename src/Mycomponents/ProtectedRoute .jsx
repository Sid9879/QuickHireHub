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


  if (isChecking) return null;

  if (!isValid) return <Navigate to="/login" />;
  if (!login) return <Navigate to="/login" />;


  if (role && user?.role !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
