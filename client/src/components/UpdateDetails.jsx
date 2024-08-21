import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { storeLogin } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

function UpdateDetails() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {handleSubmit , register , reset } = useForm()
    const userStatus = useSelector((state) => state.auth.status)

    if(!userStatus) {
    
      return (
        <div className="h-screen w-screen flex justify-center items-center"> Please <span className="mx-2 text-lg font-bold cursor-pointer" onClick={() => navigate("/login")}> Login </span> to view this page...</div>
      )
    }

    const submit = async(data) => {
        try {
            const updatedData = await axios.post("https://portfolio-maker-h2rf.onrender.com/api/users/update-account-details" , data , {withCredentials : true});
            if(updatedData) {console.log("updated data is --- " , updatedData); 
            dispatch(storeLogin(updatedData.data.data))
            navigate("/profile")
          }

        } catch (error) {
          console.log("error updating details " ,error)
        }
    }


  return (
    <div className=" flex justify-center items-center h-screen py-2 bg-gray-200 md:px-60">
    <form
      onSubmit={handleSubmit(submit)}
      encType="multipart/form-data"
      className="w-full flex flex-col md:flex-row md:w-100 h-full bg-white shadow-md rounded-lg p-6 space-y-4"
    >
     
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
       
        <div className="space-y-4">
         
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-4 rounded-md"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
  )
}

export default UpdateDetails