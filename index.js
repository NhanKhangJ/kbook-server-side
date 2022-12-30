import express  from "express";
import mongoose from "mongoose";
import cors from 'cors';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import postRouter from './routes/posts.js'
dotenv.config();

const app = express();

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

app.use('/posts', postRouter) 

const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT;




mongoose.connect(CONNECTION_URL, {useNewUrlParser: true , useUnifiedTopology: true})
.then(()=>{app.listen(PORT, ()=>{console.log(`server run on port: ${PORT} and connected to mongoose`)})})
.catch((error)=>{ console.error(error)});
