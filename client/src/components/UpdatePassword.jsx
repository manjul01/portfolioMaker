import React, { useState } from "react";
import ReactDom from "react-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { storeLogout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function PasswordForm({ open, onClose }) {
  if (!open) return null;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    oldPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const userStatus = useSelector((state) => state.auth.status)

  if(!userStatus) {
  
    return (
      <div className="h-screen w-screen flex justify-center items-center"> Please <span className="mx-2 text-lg font-bold cursor-pointer" onClick={() => navigate("/login")}> Login </span> to view this page...</div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.newPassword.trim() === "" ||
      formData.oldPassword.trim() === ""
    ) {
      alert("Please fill in all fields.");
    } else {
      try {
        const newPasswordData = await axios.post(
          "https://portfolio-maker-h2rf.onrender.com/api/users/change-password", formData ,
          { withCredentials: true }
        )
        if (newPasswordData) {
          // console.log(newPasswordData);
          const logoutUser = await axios.post(
            "https://portfolio-maker-h2rf.onrender.com/api/users/logout",
            { withCredentials: true }
          );
          if (logoutUser) {
            dispatch(storeLogout());
            onClose();
            navigate("/login");
          }
        }
      } catch (error) {
        console.log("error changing password", error);
      }
      // console.log(formData);
    }
  };

  return ReactDom.createPortal(
    <>
      <div className="backOverlay bg-black h-screen w-screen absolute top-0 bg-opacity-60"></div>
      <div className="absolute top-[20%] lg:top-[15%] lg:right-[30%] container mx-auto max-w-md mt-10 bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Update Password</h2>
        <form onSubmit={handleSubmit}>
          <button
            className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={onClose}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <div className="mb-4">
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Old Password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={toggleShowPassword}
              className="mr-2"
            />
            <label htmlFor="showPassword" className="text-sm text-gray-700">
              Show Passwords
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </>,
    document.querySelector("#portal")
  );
}

export default PasswordForm;
