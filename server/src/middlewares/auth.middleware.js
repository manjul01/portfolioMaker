import { ApiError } from "../utils/Apierror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(async (req , res , next) => {

   try {
    console.log(req.cookies)
    if(req.cookies) console.log(req.cookies)
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
 
     if(!token) throw new ApiError(401 , "unauthorized access");
 
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
     if(!user) {
         throw new ApiError(403 , "access token invalid");
     }
 
     req.user = user;
     next() 
 
   } catch (error) {
            console.log("verifyJwt error" , error);
   }
    
})

export { verifyJWT }