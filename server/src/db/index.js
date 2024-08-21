import mongoose from "mongoose"
import {DB_NAME} from "../constants.js"

const dbConnect = async() => {
    try {
        const connectionInstance = mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        if(connectionInstance) {
            console.log("db connected");
        }
    } catch (error) {
        console.log("failed to connect to db " ,error);
    }
}

export default dbConnect
