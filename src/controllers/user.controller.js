import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import  {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import Jwt  from "jsonwebtoken";

const registerUser=asyncHandler(async(req,res)=>{
   

    const {fullName,email,username,password}=req.body
    console.log("email",email);

    // if(fullName===""){
    //     throw new ApiError(404,"fullName is required");
    // }

    if([fullName,email,username,password].some((field)=> field?.trim()==="")){
        throw new ApiError(404,"All fields are required");
    }

    const existedUser= await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"user with email or username already exist");
    }

    // take avatar and coverImage to multer
    // console.log(req.files);
    const avatarLocalPath=req.files?.avatar[0]?.path;
    // const coverImageLocalPath=req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    // files upload on cloudinary
    const avatar=await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar file is required");
    }

    const user=await User.create({ fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
         email, 
         password,
        username: username.toLowerCase()

    })

    // check user created or not and remove password and refresh token
    const createdUser=await User.findById(user._id).select( " -password  -refreshToken");

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    // return response
   return res.status(201).json(
    new ApiResponse(200, createdUser ,"User registerd Successfully")
   )


})

export {registerUser}