import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { storeLogin } from '../store/authSlice';

function LoginForm() {
  
    const {register , handleSubmit , reset } = useForm();
    const [loading , setLoading] = useState(false)
    const loginUrl = "https://portfolio-maker-h2rf.onrender.com/api/users/login"
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const submit = async (data) => {
      setLoading(true)
      axios.defaults.withCredentials = true;
      // console.log("form data" , data);
      const fields = Object.values(data);
      const isFieldEmpty = fields.some((field) => field.trim().length < 1)
      if(isFieldEmpty) {
        alert("all fields are necessary")
      }

      try {
        const userData = await axios.post(loginUrl, data );
        if(userData) {
          setLoading(false)
          // console.log("user logged in " , userData.data.data.user)
          const userdata = userData.data.data.user
          dispatch(storeLogin(userdata))
          navigate("/profile")
      }
      } catch (error) {
        console.log("login failed " , error);
      }

    }

    if(loading) {
      return (
        <>
        <div className='text-7xl min-w-1 min-h-1 mx-auto my-auto'>Logging in ! Please wait...</div>
        </>
      )
    }
  return (
    <div className="container w-screen h-screen lg:px-96 bg-slate-400 lg:bg-gray-800  backdrop-blur-lg pt-40">
      <form onSubmit={handleSubmit(submit) }
      encType="multipart/form-data"
      className="w-full max-h-fit pb-5 px-8 lg:px-10 flex flex-col gap-y-6 bg-slate-400 pt-4 rounded-lg"
      >
        <div className="w-full text-center text-3xl font-mono font-extrabold my-3">Login</div>
        
      
        <input
        className="border-2 text-black bg-gray-150 rounded-md px-3 py-2 w-full"
            placeholder="email"
          type="text"
          id="email"
          {...register("Email", { required: true })}
        />
  
        <input
        className="border-2 text-black bg-gray-150 rounded-md px-3 py-2 w-full"
        placeholder="Password"
          type="password"
          id="Password"
          {...register("Password", { required: true })}
        />
      
        
        <div className="w-full flex justify-center">
            <button type="submit"
            className=" rounded-lg px-6 py-2 shadow-sm bg-slate-300 shadow-gray-600"
            >

                Submit
            </button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm