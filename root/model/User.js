import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: false
    },
    savedRecipes: {
        type: [String],
        default: [],
        required: true
    }
})

const User = mongoose.model('User', userSchema)
export default User;