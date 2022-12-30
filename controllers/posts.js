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