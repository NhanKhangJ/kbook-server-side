import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    id:{type:String}
})

const kbookUser = mongoose.model('kbookUser', userSchema);
export default kbookUser