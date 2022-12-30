import mongoose  from "mongoose";

const postSchema = mongoose.Schema({
    // creator:{
    //     type: String,
    // },
    content: String,
    tags: [String],
    selectedFile: String,
    likes:{
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const PostDetail = mongoose.model('postDetail', postSchema);

export default PostDetail;