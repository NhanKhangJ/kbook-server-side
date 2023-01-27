import mongoose from "mongoose";
import PostDetail from "../models/postsDetails.js";
import kbookUser from  "../models/user.js"


export const getPostsByCreator = async(req, res) =>{
  const {creator} = req.query
  const {time} = req.query
  try {
      const limitDocs = 4;
      const skip = (Number(time) -1) * limitDocs
      const total = await PostDetail.find({creator: creator}).countDocuments()
      const posts = await PostDetail.find({creator: creator}).sort({_id: -1}).skip(skip).limit(limitDocs)

  
      res.status(200).json({data: posts, total: total})
      // ({data: posts, totalPost: total})
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
}




export const getPosts = async(req, res) =>{
    const {time} = req.query

    try {
        const limitDocs = 4;
        const skip = (Number(time) - 1) * limitDocs
        const total = await PostDetail.countDocuments({})
        const posts = await PostDetail.find().sort({_id: -1}).skip(skip).limit(limitDocs)
        res.status(200).json({data: posts, total: total})
        // ({data: posts, totalPost: total})
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async(req,res) =>{
    const post = req.body;
    const user = await kbookUser.findById(req.userId)
    const newPost = new PostDetail({...post, creator: req.userId, creatorAvatar: user.avatar, createdAt: new Date().toISOString()})   
  
    try {
      await newPost.save();
      const total = await PostDetail.countDocuments()
      res.status(201).json({data: newPost, total : total})
    } catch (error) {
      res.status(409).json({message: error.message});     
    }
}
   
export const updatePost = async(req,res) =>{
  const {id} = req.params;
  const { creator, content, tags, selectedFile } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`); // check this id is really an mongoose Id
  const updatedPost = {creator, content, tags, selectedFile, _id: id};

  await PostDetail.findByIdAndUpdate(id, updatedPost, {new: true});
  res.json(updatedPost)
}

export const deletePost = async(req,res) =>{
  const {id} = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
  await PostDetail.findByIdAndRemove(id);
  const total = await PostDetail.countDocuments()
  res.status(200).json({data: id, total: total})
}

export const likePost = async(req,res) =>{
  const {id} = req.params;
  if(!req.userId) return res.json({ message: 'Unauthenticated'});
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
  const post = await PostDetail.findById(id);
  const user = await kbookUser.findById(req.userId);

  const index = post.likes.findIndex((p) => p.userId === String(req.userId))
  const userWhoLiked = {userId: user._id, name: user.name}
  if(index === -1){
    post.likes.push(userWhoLiked)
  } else if(index === post.likes.findIndex((p) => p.userId === String(req.userId))){
   post.likes.pull(userWhoLiked)
  }

  const updatedPost = await PostDetail.findByIdAndUpdate(id, post,{new: true})
  res.json(updatedPost)
}

export const commentPost = async(req,res) =>{
  const {id} = req.params;
  const {value} = req.body; //next step is going to be comment by picture as well
  if(!req.userId) return res.json({ message: 'Unauthenticated'});
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
  const post = await PostDetail.findById(id);
  const user = await kbookUser.findById(req.userId);
   
  const comment = { id: user._id, creator: user.name, creatorAvatar: user.avatar , comment: value}

  post.comments.push(comment)

  const updatedPost = await PostDetail.findByIdAndUpdate(id, post,{new: true})
  res.json(updatedPost)
}
