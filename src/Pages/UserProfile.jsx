import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Country, State } from "country-state-city";
import { loginUser } from "../store/userSlice";
import Layout from "../Layout/Layout";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "500px",
    Height: "40%",
    maxHeight: "40vh",
    overflowY: "scroll",
    padding: "2rem",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
    position: "fixed",
    zIndex: 1000,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
};

export default function UserProfile() {
  const [SelectedFile, setSelectedFile] = useState("");
  const userData = useSelector((state) => state.user);
  const token = userData?.token;
  const countriesData = Country.getAllCountries();
  const [statesData, setStatesData] = useState([]);
  let dispatch = useDispatch();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const useData = useSelector((state) => state.user);
  const [skills, setSkills] = useState([]);
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [stateName, setStateName] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleCountryChange = (e) => {
    const selectedCountryName = e.target.value;
    setCountryName(selectedCountryName);

    const selectedCountry = countriesData.find(
      (c) => c.name === selectedCountryName
    );
    if (selectedCountry) {
      setCountryCode(selectedCountry.isoCode);
      const states = State.getStatesOfCountry(selectedCountry.isoCode);
      setStatesData(states);
    } else {
      setCountryCode("");
      setStatesData([]);
    }
    setStateName("");
    setStateCode("");
  };

  const handleStateChange = (e) => {
    const selectedStateName = e.target.value;
    setStateName(selectedStateName);

    const selectedState = statesData.find((s) => s.name === selectedStateName);
    if (selectedState) {
      setStateCode(selectedState.isoCode);
    } else {
      setStateCode("");
    }
  };

  const handleUpdate = async () => {
    setMessage({ text: "", type: "" });

    try {
      const payload = {
        skills: skills.filter((skill) => skill.trim() !== ""),
        address: {
          city: city,
          pincode: pincode,
          countryName: countryName,
          countryCode: countryCode,
          stateName: stateName,
          stateCode: stateCode,
        },
      };

      if (password) {
        payload.password = password;
      }
      const res = await axios.put(
        `https://freelancing-backend-z0fy.onrender.com/api/users/updateProfile/${useData.user._id}`,
        payload,
        { withCredentials: true }
      );
      // console.log(res.data);
      const updatedUser = res.data.updatedUser;

      if (res.data.success && updatedUser) {
        dispatch(loginUser(updatedUser));

        setMessage({ text: "Profile updated successfully!", type: "success" });
        setModalIsOpen(false);
      }
    } catch (err) {
      console.error("Update failed", err);
      setMessage({
        text: err.response?.data?.message || "Update failed. Please try again.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleImageUpload = async () => {
    if (!SelectedFile) {
      setMessage({ text: "Please select an image to upload.", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", SelectedFile);

    try {
      const res = await axios.put(
        "https://freelancing-backend-z0fy.onrender.com/api/users/upload-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(loginUser(res.data.user));
        toast.success("Profile photo updated",{theme:"dark",position:"top-center"})
        setSelectedFile('')
      }
      setMessage({
        text: "Profile picture uploaded successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Image upload failed:", err);
      setMessage({
        text:
          err.response?.data?.message ||
          "Image upload failed. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div>
      <Layout>
        <>
          
          <div className="card mx-auto">
            <button className="mail">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-mail"
              >
                <rect width={20} height={16} x={2} y={4} rx={2} />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </button>
            <div className="profile-pic">
              <img src={userData?.user?.profilePicture} alt="" />
            </div>
            <div className="bottom">
              <div className="content">
                <strong className="name">{userData.user?.name}</strong>
               <strong className="about-me">Skills:-
    {userData.user?.skills && userData.user.skills.length > 0 ? userData.user.skills.join(', ') : 'No skills listed'}
</strong>
                <li className="list-none">
                  <strong>Address:</strong>{" "}
                  {userData?.user?.address?.city ||
                  userData?.user?.address?.pincode ||
                  userData?.user?.address?.stateName ||
                  userData?.user?.address?.countryName
                    ? `${userData.user.address.city || ""}, ${
                        userData.user.address.stateName || ""
                      }, ${userData.user.address.countryName || ""} ${
                        userData.user.address.pincode || ""
                      }`
                    : "N/A"}
                </li>
              </div>
              <div className="bottom-bottom">
                <div className="social-links-container">
                  <label
                    htmlFor="edit"
                    title="Edit Image"
                    className="cursor-pointer"
                  >
                    <Camera size={25} />
                  </label>
                  <input
                    id="edit"
                    type="file"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  {SelectedFile && ( // Show upload button only if a file is selected
                    <button
                      onClick={handleImageUpload}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Upload Photo
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {
                    const address = useData?.user?.address || {};
                    setSkills(useData?.user?.skills || []);
                    setCity(address.city || "");
                    setPincode(address.pincode || "");
                    setCountryName(address.countryName || "");
                    setCountryCode(address.countryCode || "");
                    setStateName(address.stateName || "");
                    setStateCode(address.stateCode || "");

                    const selectedCountry = countriesData.find(
                      (c) => c.name === address.countryName
                    );
                    if (selectedCountry) {
                      const states = State.getStatesOfCountry(
                        selectedCountry.isoCode
                      );
                      setStatesData(states);
                    } else {
                      setStatesData([]);
                    }

                    setPassword("");
                    setMessage({ text: "", type: "" });
                    setModalIsOpen(true);
                  }}
                  className="w-[150px] bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 rounded-md shadow transition duration-300 cursor-pointer"
                >
                  Edit Profile
                </button>
                {message.text && (
                  <div
                    className={`p-3 mb-4 rounded text-sm ${
                      message.type === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
                {modalIsOpen && (
                  <div style={modalStyles.overlay}>
                    <div style={modalStyles.content}>
                      <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        Edit Profile
                      </h2>

                      <div className="space-y-4">
                        {/* Skills Input */}
                        <div>
                          <label
                            htmlFor="skills"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Skills (comma-separated):
                          </label>
                          <input
                            type="text"
                            id="skills"
                            placeholder="e.g., React, Node.js, MongoDB"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={skills.join(", ")}
                            onChange={(e) =>
                              setSkills(
                                e.target.value
                                  .split(",")
                                  .map((skill) => skill.trim())
                              )
                            }
                          />
                        </div>

                        {/* City Input */}
                        <div>
                          <label
                            htmlFor="city"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            City:
                          </label>
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
                          <label
                            htmlFor="pincode"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Pincode:
                          </label>
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
                          <label
                            htmlFor="country"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Country:
                          </label>
                          <select
                            id="country"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={countryName}
                            onChange={handleCountryChange}
                          >
                            <option value="">Select Country</option>
                            {countriesData.map((c) => (
                              <option key={c.isoCode} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* State Selection Dropdown (only visible if a country is selected) */}
                        {countryName && (
                          <div>
                            <label
                              htmlFor="state"
                              className="block text-gray-700 text-sm font-bold mb-2"
                            >
                              State:
                            </label>
                            <select
                              id="state"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={stateName}
                              onChange={handleStateChange}
                            >
                              <option value="">Select State</option>
                              {statesData.map((s) => (
                                <option key={s.isoCode} value={s.name}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Country Code Display/Input (Auto-populated or optional input if needed) */}
                        <div>
                          <label
                            htmlFor="countryCode"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Country Code (e.g., US, IN):
                          </label>
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
                          <label
                            htmlFor="stateCode"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            State Code (e.g., CA, NY):
                          </label>
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
                          <label
                            htmlFor="password"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            New Password (leave blank to keep current):
                          </label>
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
          </div>
        </>
      </Layout>
      <style>
        {`
                    /* From Uiverse.io by Smit-Prajapati */
.card {
  width: 600px;
  height: 400px;
  background: white;
  border-radius: 32px;
  padding: 3px;
  position: relative;
  box-shadow: #604b4a30 0px 70px 30px -50px;
  transition: all 0.5s ease-in-out;
  background:aqua
}

.card .mail {
  position: absolute;
  right: 2rem;
  top: 1.4rem;
  background: transparent;
  border: none;
}

.card .mail svg {
  stroke: #fbb9b6;
  stroke-width: 3px;
}

.card .mail svg:hover {
  stroke: #f55d56;
}

.card .profile-pic {
  position: absolute;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  top: 3px;
  left: 3px;
  border-radius: 29px;
  z-index: 1;
  border: 0px solid #fbb9b6;
  overflow: hidden;
  transition: all 0.5s ease-in-out 0.2s, z-index 0.5s ease-in-out 0.2s;
}

.card .profile-pic img {
  -o-object-fit: cover;
  object-fit: cover;
  width: 100%;
  height: 100%;
  -o-object-position: 0px 0px;
  object-position: 0px 0px;
  transition: all 0.5s ease-in-out 0s;
}

.card .profile-pic img {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: 0px 0px;
  object-position: 0px 0px;
  transform-origin: 45% 20%;
  transition: all 0.5s ease-in-out 0s;
}

.card .bottom {
  position: absolute;
  bottom: 3px;
  left: 3px;
  right: 3px;
  background: #fbb9b6;
  top: 80%;
  border-radius: 29px;
  z-index: 2;
  box-shadow: rgba(96, 75, 74, 0.1882352941) 0px 5px 5px 0px inset;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
}

.card .bottom .content {
  position: absolute;
  bottom: 0;
  left: 1.5rem;
  right: 1.5rem;
  height: 160px;
}

.card .bottom .content .name {
  display: block;
  font-size: 1.2rem;
  color: white;
  font-weight: bold;
}

.card .bottom .content .about-me {
  display: block;
  font-size: 0.9rem;
  color: white;
  // margin-top: 1rem;
}

.card .bottom .bottom-bottom {
  position: absolute;
  bottom: 1rem;
  left: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card .bottom .bottom-bottom .social-links-container {
  display: flex;
  gap: 1rem;
}

.card .bottom .bottom-bottom .social-links-container svg {
  height: 20px;
  fill: white;
  filter: drop-shadow(0 5px 5px rgba(165, 132, 130, 0.1333333333));
}

.card .bottom .bottom-bottom .social-links-container svg:hover {
  fill: #f55d56;
  transform: scale(1.2);
}

.card .bottom .bottom-bottom .button {
  background: white;
  color: #fbb9b6;
  border: none;
  border-radius: 20px;
  padding: 0.4rem 0.6rem;
  box-shadow: rgba(165, 132, 130, 0.1333333333) 0px 5px 5px 0px;
}

.card .bottom .bottom-bottom .button:hover {
  background: #f55d56;
  color: white;
}

.card:hover {
  border-top-left-radius: 55px;
}

.card:hover .bottom {
  top: 20%;
  border-radius: 80px 29px 29px 29px;
  transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0.2s;
}

.card:hover .profile-pic {
  width: 100px;
  height: 100px;
  aspect-ratio: 1;
  top: 10px;
  left: 10px;
  border-radius: 50%;
  object-fit: cover;
  -o-object-position: 0px 0px;
  object-position: 0px 0px;
  z-index: 3;
  border: 7px solid #fbb9b6;
  box-shadow: rgba(96, 75, 74, 0.1882352941) 0px 5px 5px 0px;
  transition: all 0.5s ease-in-out, z-index 0.5s ease-in-out 0.1s;
}

.card:hover .profile-pic:hover {
  transform: scale(1.3);
  border-radius: 0px;
}

.card:hover .profile-pic img {
  transform: scale(2.5);
  -o-object-position: 0px 0px;
  object-position: -10px 10px;
  transition: all 0.5s ease-in-out 0.5s;
}

.card:hover .profile-pic img {
  transform: scale(2.5);
  transition: all 0.5s ease-in-out 0.5s;
}
                    `}
      </style>
    </div>
  );
}
