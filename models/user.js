import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    id:{type:String},
    avatar:{type:String},
    cover:{type:String},
    job:{type:String},
    education:{type:String},
    location:{type:String},
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const kbookUser = mongoose.model('kbookUser', userSchema);
export default kbookUser