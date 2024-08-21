import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/Apierror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { extractIdentifierFromURL } from "../utils/extractPublicID.js";
import cookie from "cookie"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser = asyncHandler(async (req , res ) => {

    const { Name , Email , Contact , Password , Linkedin , Instagram , Github , About } = req.body;

    if([Name , Email , Contact , Password , Linkedin , Instagram , Github , About].some((field) => field?.trim() === "")) {

        throw new ApiError(400 , "All fields are required")
    }

    const existedUser = await User.findOne({Email : Email})

    if(existedUser) {
        throw new ApiError(400 , "user with this email already exist");
    }
    // console.log("files are =====", req.files);

    const coverLocalPath  = req.files?.Cover[0].path
    const profileLocalPath = req.files?.Profile[0].path

    if(!coverLocalPath || !profileLocalPath) {
        throw new ApiError(400 , "images are not uploaded multer error")
    }
    
    const Profile = await uploadOnCloudinary(profileLocalPath)
    const Cover = await uploadOnCloudinary(coverLocalPath)

    if(!Profile || !Cover) {
        throw new ApiError(500 , "cloudinary upload failed at controller")
    }

    const user = await  User.create({
        Name , Email , Contact , Password , Linkedin , Instagram , Github ,
        Profile : Profile.url , Cover : Cover.url , About : About
    })

    const createdUser = await User.findById(user._id).select(
        "-Password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500 , "unable to create user");
    }

    return res
    .status(201)
    .json( new ApiResponse(200, createdUser, "User registered Successfully"))



})

const loginUser = asyncHandler(async (req , res) => {

    const {Email , Password} = req.body;

    if(!Email || !Password) {
        throw new ApiError(400 , "email or password not provided");
    }

    const user = await User.findOne({Email});
    if(!user) {
        throw new ApiError(401 , "wrong email");
    }
    // console.log(Email , Password)
    const passwordCheck = await user.isPasswordCorrect(Password);

    if(!passwordCheck) {
        throw new ApiError(402 , "password incorrect");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-Password -refreshToken")

    const options = {
        maxAge: 86400000, // Cookie expires in 1 day (in milliseconds)
        httpOnly: true,
        secure: true,
        sameSite: "None" ,
        partitioned : true// Correct capitalization
      };

    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
          user: loggedInUser,
          accessToken,
          refreshToken
        }
      });
    
})

const logoutUser = asyncHandler(async (req , res) => {
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 
            }
        },
        {
            new: true
        }
    )

    const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    partitioned : true
  };
  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);

  // Send a simple JSON response indicating successful logout
  res.status(200).json({ success: true, message: "User logged out successfully" });
})  

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.Password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


//login krne k baad user get krna hai 
const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})


const updateAccountDetails = asyncHandler(async(req , res) => {

    const { Name , Email , Contact , Linkedin , Instagram , Github , About } = req.body;

    if( [ Name , Email , Contact , Linkedin , Instagram , Github].some((field) => field?.trim().length < 1) ) {
        throw new ApiError(401 , "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
           $set : {Name : Name , Email : Email , Contact : Contact , Linkedin : Linkedin , Instagram : Instagram , Github :Github  , About: About}
        },
        {new : true}
    ).select("-Password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const updateProfile = asyncHandler(async(req , res) => {

    const profileLocalPath = req.file.path;

    if(!profileLocalPath) {
        throw new ApiError(401 , "file not uploaded");
    }

    const user = await User.findById(req.user._id);
    if(!user) {
        throw new ApiError(401 , "unauthorized access");
    }

    const oldProfileUrl =  user.Profile
    const newProfile = await  uploadOnCloudinary(profileLocalPath);

    if(!newProfile.url) {
        throw new ApiError(401 , "file not uploaded cloudinary");
    }

    user.Profile = newProfile.url
    user.save(
        {validateBeforeSave: false}
    )
    
    const publicID = extractIdentifierFromURL(oldProfileUrl)
    if(publicID)
    {   
        // console.log(publicID)
        await deleteFromCloudinary(publicID) 
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Profile image updated successfully")
    )
})

const updateCover = asyncHandler(async (req , res) => {
    const coverLocalFilePath = req.file.path

    if(!coverLocalFilePath) {
        throw new ApiError(401 , "file not uploaded");
    }

    const user = await User.findById(req.user._id);
    if(!user) {
        throw new ApiError(401 , "unauthorized access");
    }

    const oldCover =  user.Cover
    const newProfile = await  uploadOnCloudinary(coverLocalFilePath);

    if(!newProfile.url) {
        throw new ApiError(401 , "file not uploaded cloudinary");
    }

    user.Cover = newProfile.url
    user.save(
        {validateBeforeSave: false}
    )
    
    const publicID = extractIdentifierFromURL(oldCover)
    if(publicID)
    {   
        // console.log(publicID)
        await deleteFromCloudinary(publicID) 
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Profile image updated successfully")
    )

})
export { 
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateProfile,
    updateCover
}