import React, {  useState } from "react";
import ReactDom from "react-dom"
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { storeLogin } from "../store/authSlice";

const UpdateImage = ({target , open , onClose}) => {
  const dispatch = useDispatch()
  const [selectedFile, setSelectedFile] = useState("");
  const navigate = useNavigate()
  const userdata = useSelector((state) => state.auth.userdata)
  const userStatus = useSelector((state) => state.auth.status)

  if(!userStatus) {
  
    return (
      <div className="h-screen w-screen flex justify-center items-center"> Please <span className="mx-2 text-lg font-bold cursor-pointer" onClick={() => navigate("/login")}> Login </span> to view this page...</div>
    )
  }
  
    if(!open) return null
    
  const handlChange = (e) => {
    setSelectedFile(e.target.files[0]);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const formData = new FormData();
        formData.append(target, selectedFile);

        const updatedData = await axios.post(
            `https://portfolio-maker-h2rf.onrender.com/api/users/update-${target.toLowerCase()}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            }
        );

        const newUserData = updatedData.data.data;

        const updatedUserdata = {
            ...userdata,
            [target]: newUserData[target]
        };

        dispatch(storeLogin(updatedUserdata));
        onClose();
        navigate('/profile');
    } catch (error) {
        console.log("error updating profile", error);
    }
};

  return ReactDom.createPortal(
    <> 
    <div className="backOverlay bg-black h-screen w-screen absolute top-0 bg-opacity-60"></div>
    <div className="absolute w-full max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md top-[20%] lg:right-[30%] ">
      <button className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      onClick={ onClose }
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

      <form className="mt-6">
        <div>
          <label
            htmlFor="profile_image"
            className="block text-sm font-medium text-gray-700"
          >
            {`${target} Image`}
          </label>
          <div className="mt-1">
            <input
              id="profile_image"
              name="profile_image"
              type="file"
              
              onChange={(e) => handlChange(e)}
              className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            onClick={(e) => handleSubmit(e)}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
    </>,
    document.querySelector('#portal')
  );
};

export default UpdateImage;
