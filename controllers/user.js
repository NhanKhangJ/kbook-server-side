import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';
import kbookUser from '../models/user.js';
import PostDetail from "../models/postsDetails.js";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()

export const signin = async(req,res) =>{
    const {email, password} = req.body;
    try {
        const existingUser = await kbookUser.findOne({email});

        if(!existingUser) return res.status(404).json({message: "User doesn't exist"});

        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);

        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials"})
        
        const decodeMessage = "Thank you decoding this and please don't try to steal my users information"
         
        const token = jwt.sign({ message: decodeMessage ,id: existingUser._id}, process.env.SECRET, {expiresIn: "1h"}) //send this token to the localstorage and It up to you to set the expire time 
         //email: existingUser.email
        res.status(200).json({result: { _id: existingUser._id }, token})
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const signup = async(req,res) =>{
    const {email, password, confirmPassword, firstName, lastName} = req.body;

    try {
        const existingUser = await kbookUser.findOne({ email });

        if (existingUser) return res.status(400).json({message: "User already exist"});

        if(password !== confirmPassword) return res.status(400).json({message: "Passwords don't match"})

        const hashPassword = await bcrypt.hash(password,12)

        const result = await kbookUser.create({email, password: hashPassword, name:`${firstName} ${lastName}`});
        const decodeMessage = "Thank you decoding this and please don't try to steal my users information"

        const token = jwt.sign({ message: decodeMessage, id: result._id}, process.env.SECRET, {expiresIn: "1h"});
    
        res.status(200).json({result: { _id: existingUser._id },token})
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong'})
    }
}


export const getUser = async(req, res) =>{
    const { id } = req.params;
    try {
        const user  = await kbookUser.findById(id).select("-password -email");
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ message: error.message})
    }
}

export const getUsers = async(req,res) =>{
    try {
        const users = await kbookUser.find().select("-password -email")
        res.json(users)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateUser = async (req,res) =>{
    const { id } = req.params;
    const {avatar, cover, job, education, location} = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);
    // Find the post to update the Avatar
    const updatedUser = {avatar, cover, job, location, education, _id: id}
    await PostDetail.updateMany({creator : req.userId}, { $set: { creatorAvatar: avatar } }); 
    await PostDetail.updateMany({'comments.id' : req.userId.toString()}, {$set: {'comments.$.creatorAvatar' : avatar}})
    await kbookUser.findByIdAndUpdate(id, updatedUser, {new: true})
    res.json(updatedUser)
}