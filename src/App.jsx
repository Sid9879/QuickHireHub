import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import Login from './Pages/Login'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './Mycomponents/Navbar'
import Signup from './Pages/Signup'
import LandingPage from './Mycomponents/LandingPage'
import About from './Pages/About'
import Contact from './Pages/Contact'
import FreelancerDashboard from './Mycomponents/Dashboard'
import JoblistingsPage from './Job/JoblistingsPage';
import JobDetailsPage from './Job/JobDetailsPage';
import Job from './Job/Job';
import Application from './Job/Application';
import ClientDashboard from './Mycomponents/ClientDashboard';
import ClientPosted from './Job/ClientPosted';
import UserProfile from './Pages/UserProfile';
import {useSelector } from 'react-redux';
import ProtectedRoute from './Mycomponents/ProtectedRoute ';
import ViewUserProfile from './Layout/ViewUserProfile';
import ForgetPassword from './Pages/ForgetPassword';
import ManageProjects from './Pages/ManageProjects ';
import ChooseRole from './Pages/ChooseRole';


function App() {

  const userData = useSelector((state)=>state.user)

  
  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
  {/* Public Routes */}
  <Route path="/login" element={!userData.login ? <Login /> : <Navigate to="/" />} />
  <Route path="/forgetPassword" element={!userData.login ? <ForgetPassword /> : <Navigate to="/" />} />
  <Route path="/signup" element={!userData.login ? <Signup /> : <Navigate to="/" />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/" element={
      <LandingPage />
  }/>

  {/* Authenticated Routes */}

  <Route path="/yourDashboard" element={
    <ProtectedRoute role="freelancer">
      <FreelancerDashboard />
    </ProtectedRoute>
  }/>

  <Route path="/Client/Dashboard" element={
    <ProtectedRoute role="client">
      <ClientDashboard />
    </ProtectedRoute>
  }/>

  <Route path="/createjob" element={
    <ProtectedRoute role="client">
      <JoblistingsPage />
    </ProtectedRoute>
  }/>

  <Route path="/jobs" element={
    <ProtectedRoute>
      <Job />
    </ProtectedRoute>
  }/>

  <Route path="/details" element={
    <ProtectedRoute>
      <JobDetailsPage />
    </ProtectedRoute>
  }/>

  <Route path="/yourDashboard/application" element={
    <ProtectedRoute role="freelancer">
      <Application />
    </ProtectedRoute>
  }/>

  <Route path="/client-posted" element={
    <ProtectedRoute role="client">
      <ClientPosted />
    </ProtectedRoute>
  }/>

  <Route path="/UserProfile" element={
    <ProtectedRoute>
      <ViewUserProfile/>
    </ProtectedRoute>
  }/>

  <Route path="/yourDashboard/UserProfile" element={
    <ProtectedRoute>
      <UserProfile/>
    </ProtectedRoute>
  }/>
   <Route path="/freelancer/manage-projects" element={
    <ProtectedRoute>
      <ManageProjects/>
    </ProtectedRoute>
  }/>

 <Route path="/choose-role" element={
      <ProtectedRoute>
        <ChooseRole />
        </ProtectedRoute>
  }/>

</Routes>

      <ToastContainer />
    </BrowserRouter>
    </>
  )
}

export default App
