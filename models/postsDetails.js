import mongoose  from "mongoose";

const postSchema = mongoose.Schema({
    creator: String,
    name: String,
    content: String,
    tags: [String],
    selectedFile: String,
    // likes:{
    //     type: [String],
    //     default: []
    // },
    likes:{
        type: [mongoose.Schema({
            userId: String,
            name: String
        }, {_id: false})],
        default: []
    },
    comments:{
        type: [mongoose.Schema({
            id: Number,
            creator: String,
            comment: String,
        })]   
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const PostDetail = mongoose.model('postDetail', postSchema);

export default PostDetail;