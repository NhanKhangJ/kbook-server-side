import mongoose from "mongoose";
import PostDetail from "../models/postsDetails.js";
import kbookUser from  "../models/user.js"

export const getPosts = async(req, res) =>{
    try {
        const posts = await PostDetail.find()
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async(req,res) =>{
    const post = req.body;
    const newPost = new PostDetail({...post, creator: req.userId, createdAt: new Date().toISOString()})   
    try {
      await newPost.save();
      res.status(201).json(newPost)
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

  res.json({ message: 'Post deleted susccessfully'})
}

export const likePost = async(req,res) =>{
  const {id} = req.params;
  if(!req.userId) return res.json({ message: 'Unauthenticated'});
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
  const post = await PostDetail.findById(id);
  const user = await kbookUser.findById(req.userId);
  // console.log(user);
  const index = post.likes.findIndex((id) => id === String(req.userId))
  // const index = post.likes.findIndex((p) => p[userId] === String(req.userId))
  // const userWhoLiked = {userId: user._id, name: user.name}
  if(index === -1){
    post.likes.push(req.userId)
    //post.likes.push(userWhoLiked)
  } else{
    post.likes = post.likes.filter((id) => id !== String(req.userId))
    //posts.likes.filter((userWholike) => userWholike[userId] !== String(req.userId))
  }

  const updatedPost = await PostDetail.findByIdAndUpdate(id, post,{new: true})

  res.json(updatedPost)
}