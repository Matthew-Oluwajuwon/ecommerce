import mongoose from "mongoose";
import { connectionString } from "../utils/envConfig";

const dbConnection = async() => {
    try {
        mongoose.connect(connectionString as string)
        console.log("Database connection established")
    } catch (error) {
        throw new Error(`Database connection failed: ${error}`)
    }
}

export default dbConnection