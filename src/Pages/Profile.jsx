import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Country, State } from 'country-state-city';
import { loginUser } from '../store/userSlice';

// Custom Modal Styling (adjusted for a div-based modal)
const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '500px',
        Height:"40%",
        maxHeight: '40vh',
        overflowY: 'scroll',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        position: 'fixed', 
        zIndex: 1000, 
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
    }
};

const Profile = () => {
    const countriesData = Country.getAllCountries(); // ✅ add this
    const [statesData, setStatesData] = useState([]);
    let dispatch = useDispatch();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const useData = useSelector((state) => state.user);
    console.log(useData);
    const [skills, setSkills] = useState([]);
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [countryName, setCountryName] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [stateName, setStateName] = useState('');
    const [stateCode, setStateCode] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleCountryChange = (e) => {
        const selectedCountryName = e.target.value;
        setCountryName(selectedCountryName);

        const selectedCountry = countriesData.find(c => c.name === selectedCountryName);
        if (selectedCountry) {
            setCountryCode(selectedCountry.isoCode);
            const states = State.getStatesOfCountry(selectedCountry.isoCode);
            setStatesData(states);
        } else {
            setCountryCode('');
            setStatesData([]);
        }
        setStateName('');
        setStateCode('');
    };

    const handleStateChange = (e) => {
        const selectedStateName = e.target.value;
        setStateName(selectedStateName);

        const selectedState = statesData.find(s => s.name === selectedStateName);
        if (selectedState) {
            setStateCode(selectedState.isoCode);
        } else {
            setStateCode('');
        }
    };

    const handleUpdate = async () => {
        setMessage({ text: '', type: '' }); 
        
        try {
            const payload = {
                skills: skills.filter(skill => skill.trim() !== ''),
                address: {
                    city: city,
                    pincode: pincode,
                    countryName: countryName,
                    countryCode: countryCode,
                    stateName: stateName,
                    stateCode: stateCode
                }
            };

            if (password) {
                payload.password = password;
            }
            const res = await axios.put(`https://freelancing-backend-z0fy.onrender.com/api/users/updateProfile/${useData.user._id}`,
                payload,
                { withCredentials: true }
            );
            console.log(res.data);
            const updatedUser = res.data.updatedUser;

            if (res.data.success && updatedUser) {
                dispatch(loginUser(updatedUser));

                setMessage({ text: 'Profile updated successfully!', type: 'success' });
                setModalIsOpen(false);
            }
        } catch (err) {
            console.error('Update failed', err);
            setMessage({ text: err.response?.data?.message || 'Update failed. Please try again.', type: 'error' });
        }
    };
useEffect(() => {
  if (message.text) {
    const timer = setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [message]);
    return (
        <div className="min-h-screen bg-gradient-to-tr from-[#e1b382] via-[#c89666] to-[#2d545e] text-gray-900 p-6">
            <div className="max-w-4xl mx-auto bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8 mt-10">
                {/* Header Section */}
                <header className="flex justify-between items-center border-b border-gray-300 pb-4 mb-6">
                    {/* Using a placeholder image directly */}
                    <img className='w-[100px] h-[100px] rounded-full object-cover' src={useData?.user?.profilePicture || 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Logo'} alt="Application Logo" />
                </header>

                {/* Profile Summary Section */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-2">Profile Summary:</h2>
                    <ul className="space-y-1 text-gray-700">
                        <li><strong>Name:</strong> {useData?.user?.name || 'N/A'}</li>
                        <li>
                            <strong>Skills:</strong> {useData?.user?.skills?.length ? useData.user?.skills.join(', ') : 'Add your Skills from profile section'}
                        </li>
                        <li>
                            <strong>Address:</strong>{' '}
                            {useData?.user?.address?.city ||
                            useData?.user?.address?.pincode ||
                            useData?.user?.address?.stateName ||
                            useData?.user?.address?.countryName
                                ? `${useData.user.address.city || ''}, ${useData.user.address.stateName || ''}, ${useData.user.address.countryName || ''} ${useData.user.address.pincode || ''}`
                                : 'N/A'}
                        </li>
                    </ul>
                </section>

                {/* Action Buttons Section */}
                <section className="flex space-x-4 mb-8">
                    {/* <button
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-center py-3 rounded-md shadow transition duration-300"
                    >
                        View Applications
                    </button> */}
                    
                   
                    <button
                        onClick={() => {
                            const address = useData?.user?.address || {};
                            setSkills(useData?.user?.skills || []);
                            setCity(address.city || '');
                            setPincode(address.pincode || '');
                            setCountryName(address.countryName || '');
                            setCountryCode(address.countryCode || '');
                            setStateName(address.stateName || '');
                            setStateCode(address.stateCode || '');

                            // Load states for the selected country to populate states dropdown
                            const selectedCountry = countriesData.find(c => c.name === address.countryName);
                            if (selectedCountry) {
                                const states = State.getStatesOfCountry(selectedCountry.isoCode);
                                setStatesData(states);
                            } else {
                                setStatesData([]);
                            }

                            setPassword('');
                            setMessage({ text: '', type: '' });
                            setModalIsOpen(true);
                        }}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 rounded-md shadow transition duration-300"
                    >
                        Edit Profile
                    </button>
                </section>

                {/* Message display area for success/error */}
                {message.text && (
                    <div className={`p-3 mb-4 rounded text-sm ${
                        message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Edit Modal (now a conditionally rendered div) */}
                {modalIsOpen && (
                    <div style={modalStyles.overlay}>
                        <div style={modalStyles.content}>
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>

                            <div className="space-y-4">
                                {/* Skills Input */}
                                <div>
                                    <label htmlFor="skills" className="block text-gray-700 text-sm font-bold mb-2">Skills (comma-separated):</label>
                                    <input
                                        type="text"
                                        id="skills"
                                        placeholder="e.g., React, Node.js, MongoDB"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={skills.join(', ')}
                                        onChange={(e) => setSkills(e.target.value.split(',').map(skill => skill.trim()))}
                                    />
                                </div>

                                {/* City Input */}
                                <div>
                                    <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">City:</label>
                                    <input
                                        type="text"
                                        id="city"
                                        placeholder="City"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>

                                {/* Pincode Input */}
                                <div>
                                    <label htmlFor="pincode" className="block text-gray-700 text-sm font-bold mb-2">Pincode:</label>
                                    <input
                                        type="number"
                                        id="pincode"
                                        placeholder="Pincode"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={pincode}
                                        onChange={(e) => setPincode(Number(e.target.value))}
                                    />
                                </div>

                                {/* Country Selection Dropdown */}
                                <div>
                                    <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">Country:</label>
                                    <select
                                        id="country"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={countryName}
                                        onChange={handleCountryChange}
                                    >
                                        <option value="">Select Country</option>
                                        {countriesData.map((c) => (
                                            <option key={c.isoCode} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* State Selection Dropdown (only visible if a country is selected) */}
                                {countryName && (
                                    <div>
                                        <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">State:</label>
                                        <select
                                            id="state"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={stateName}
                                            onChange={handleStateChange}
                                        >
                                            <option value="">Select State</option>
                                            {statesData.map((s) => (
                                                <option key={s.isoCode} value={s.name}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Country Code Display/Input (Auto-populated or optional input if needed) */}
                                <div>
                                    <label htmlFor="countryCode" className="block text-gray-700 text-sm font-bold mb-2">Country Code (e.g., US, IN):</label>
                                    <input
                                        type="text"
                                        id="countryCode"
                                        placeholder="Country Code"
                                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={countryCode}
                                        readOnly // Making it read-only as it's derived from country selection
                                    />
                                </div>

                                {/* State Code Display/Input (Auto-populated or optional input if needed) */}
                                <div>
                                    <label htmlFor="stateCode" className="block text-gray-700 text-sm font-bold mb-2">State Code (e.g., CA, NY):</label>
                                    <input
                                        type="text"
                                        id="stateCode"
                                        placeholder="State Code"
                                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={stateCode}
                                        readOnly // Making it read-only as it's derived from state selection
                                    />
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">New Password (leave blank to keep current):</label>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="New Password"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                {/* Save Changes Button */}
                                <button
                                    className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 transition duration-300"
                                    onClick={handleUpdate}
                                >
                                    Save Changes
                                </button>
                                {/* Cancel Button */}
                                <button
                                    className="w-full mt-2 bg-gray-200 text-gray-800 font-semibold p-3 rounded-lg hover:bg-gray-300 transition duration-300"
                                    onClick={() => setModalIsOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
