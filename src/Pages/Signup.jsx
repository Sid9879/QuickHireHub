import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';

const Signup = () => {
  let navigate = useNavigate();
  const [role, setRole] = useState('');
  const [skillsVisible, setSkillsVisible] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [skills, setSkills] = useState('');

  const handleRoleChange = (e) => {
    e.preventDefault()
    setRole(e.target.value);
    setSkillsVisible(e.target.value === 'freelancer');
    if (e.target.value !== 'freelancer') {
      setSkills(''); // Clear skills if not freelancer
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      const sanitizedData = {
    name: DOMPurify.sanitize(name),
    email: DOMPurify.sanitize(email),
    phone: DOMPurify.sanitize(phone),
    password: DOMPurify.sanitize(password),
    role: DOMPurify.sanitize(role)
  };
   try {
     let res = await axios.post(`https://freelancing-backend-z0fy.onrender.com/api/auth/register`,sanitizedData)
      let data = res.data;
      // console.log(res)
      if(data.success){
         toast.success(data.message,{position:"top-center",theme:"dark"})
        navigate('/login')
      }
   } catch (error) {
    // console.log(error)
      toast.error(
    error.response?.data?.errors?.[0]?.msg ||
    error.response?.data?.message || 
    "Registration failed",  
    { position: "top-center", theme: "dark" }
);
   }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-xl w-full max-w-md p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-pink-500"></div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 tracking-wide">Signup</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Role:</label>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="freelancer"
                checked={role === 'freelancer'}
                onChange={handleRoleChange}
                className="accent-purple-600"
              />
              <span>Freelancer</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="client"
                checked={role === 'client'}
                onChange={handleRoleChange}
                className="accent-blue-600"
              />
              <span>Client</span>
            </label>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            name="phone"
            type="tel"
            autoComplete="off"
            inputMode="numeric"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-purple-400"
            required
          />

          {/* {skillsVisible && (
            <select
  value={skills}
  onChange={(e) => setSkills(e.target.value)}
  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-purple-400"
>
  <option value="" disabled>Select Skills</option>
  <option value="Web Development">Web Development</option>
  <option value="Graphic Design">Graphic Design</option>
  <option value="Content Writing">Content Writing</option>
  <option value="SEO">SEO</option>
</select>

          )} */}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-2 rounded font-semibold hover:shadow-lg transition duration-300"
          >
            Signup
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
