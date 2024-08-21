import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-slate-800 bg-opacity-20 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex-grow flex flex-col sm:flex-row items-center justify-center">
        <div className="bg-white rounded-lg shadow-md overflow-hidden sm:w-1/2">
          <img
            src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8NYnGDqrQm-gbf4fbXkaMBzmVLlf2rZdOLA&s"}
            alt="Portfolio"
            className="w-full h-auto"
          />
        </div>

        <div className="text-center mt-8 sm:mt-0 sm:ml-8 sm:w-1/2">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome to My Portfolio Website
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Your portfolio is your professional showcase to the world. With our
            platform, you can easily create and manage your portfolio by
            entering your details.
          </p>
          <p className="mt-2 text-lg text-gray-600">
            Update your profile and cover images anytime to keep your portfolio
            fresh and engaging. Join us today and start building your online
            presence!
          </p>

          <div className="grid grid-cols-1 gap-6 mt-8 sm:mt-12">
            <button 
            onClick={() => navigate("/login")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
              Log In
            </button>
            <button 
            onClick={() => navigate("/register")}
            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 focus:ring-offset-gray-100">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
