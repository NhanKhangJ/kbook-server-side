import mongoose from "mongoose";
import PostDetail from "../models/postsDetails.js";

export const getPosts = async(req, res) =>{
    try {
        const posts = await PostDetail.find()
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async(req,res) =>{
    const {content,tags,selectedFile} = req.body;
    const newPost = new PostDetail({content, tags, selectedFile})   
    try {
      await newPost.save();
      res.status(201).json(newPost)
    } catch (error) {
      res.status(409).json({message: error.message});     
    }
}

export const updatePost = async(req,res) =>{
  const {id} = req.params;
  const {content ,tags, selectedFile } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`); // check this id is really an mongoose Id
  const updatedPost = {content, tags, selectedFile, _id: id};

  await PostDetail.findByIdAndUpdate(id, updatedPost, {new: true});
  res.json(updatedPost)
}

export const deletePost = async(req,res) =>{
  const {id} = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  await PostDetail.findByIdAndRemove(id);

  res.json({ message: 'Post deleted susccessfully'})
}