import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    Name : {
        type : String,
        required : true
    },
    Email : {
        type : String,
        required : true
    }, 
    Contact : {
        type : String,
        required : true
    },
    Password : {
        type : String,
        required : true
    },
    Linkedin: {
        type : String,
        required : true
    },
    Instagram : {
        type : String,
        required : true
    },
    Github : {
        type : String, 
        required : true
    },
    Profile : {
        type : String,
        required : true
    },
    Cover : {
        type : String,
        required : true
    },
    refreshToken: {
        type: String
    },
    About : {
        type : String
    }
    
} , {timestamps : true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("Password")) return next();

    this.Password = await bcrypt.hash(this.Password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(Password){
    return await bcrypt.compare(Password, this.Password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User" , userSchema)