import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { register, handleSubmit, reset } = useForm();
  const registerURL = "https://portfolio-maker-h2rf.onrender.com/api/users/register";
  const [loading , setLoading] = useState(false)
  
  const submit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "Profile" || key === "Cover") {
        
        formData.append(key, value[0]); 
      } else {
        formData.append(key, value);
      }
    });

    try {
      const userData = await axios.post(registerURL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if(userData) {
        setLoading(false)
        // console.log(userData)
        navigate('/login')
      }
      // console.log("User created:", userData.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  if(loading) 
  {
    return (
      <>
      <div className="mx-auto my-auto text-7xl">
        Creating User Please wait...
      </div>
      </>
    )
  }
  return (
    <div className=" flex justify-center items-center h-screen py-2 bg-gray-200 md:px-60">
      <form
        onSubmit={handleSubmit(submit)}
        encType="multipart/form-data"
        className="w-full flex flex-col md:flex-row md:w-100 h-full bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        {/* Left Half */}
        <div className="w-full p-5">
          <div className="text-center text-xl font-extrabold mb-6">
            Register
          </div>
          <div className="space-y-4">
            <div className="border border-gray-300 rounded-md p-2">
              <input
                className="input-field"
                type="text"
                placeholder="Name"
                {...register("Name", { required: true })}
              />
            </div>
            <div className="border border-gray-300 rounded-md p-2">
              <input
                className="input-field"
                type="text"
                placeholder="Email"
                {...register("Email", { required: true })}
              />
            </div>
            <div className="border border-gray-300 rounded-md p-2">
              <input
                className="input-field"
                type="text"
                placeholder="Contact No."
                {...register("Contact", { required: true })}
              />
            </div>
            <div className="border border-gray-300 rounded-md p-2">
              <input
                className="input-field"
                type="text"
                placeholder="Password"
                {...register("Password", { required: true })}
              />
            </div>
            <div className="border border-gray-300 rounded-md p-2">
              <input
                className="input-field"
                type="text"
                placeholder="Instagram Profile"
                {...register("Instagram", { required: true })}
              />
            </div>
            <div className="border border-gray-300 rounded-md p-2">
              <input
                className="input-field"
                type="text"
                placeholder="Github Profile"
                {...register("Github", { required: true })}
              />
            </div>
            <div className="border border-gray-300 rounded-md p-2">
              <input
                className="input-field"
                type="text"
                placeholder="Linkedin Profile"
                {...register("Linkedin", { required: true })}
              />
            </div>
          </div>
        </div>

        {/* Right Half */}
        <div className="w-full">
        <div className="text-center text-xl font-extrabold mb-4">
            About Me
          </div>
        <div className="border border-gray-300 rounded-md p-2">
            <textarea
              className="input-field w-full h-32 resize-none"
              placeholder="Write something about yourself..."
              {...register("About", { required: true })}
            />
          </div>
          <div className="text-center text-xl font-extrabold mb-6">
            Upload Files
          </div>
          <div className="space-y-4">
            <div className="border border-gray-300 rounded-md p-2">
              <label htmlFor="profile">Profile Image:</label>
              <input type="file" id="Profile" {...register("Profile")} />
            </div>
            <div className="border border-gray-300 rounded-md p-2">
              <label htmlFor="cover">Cover Image:</label>
              <input type="file" id="cover" {...register("Cover")} />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
