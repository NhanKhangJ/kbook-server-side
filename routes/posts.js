import express from 'express';
import { getPosts, createPost, updatePost, deletePost,likePost, commentPost, getPostsByCreator } from '../controllers/posts.js';
import auth from '../middleware/auth.js';

const router = express.Router();


router.get('/public',auth, getPosts);
router.get('/user',auth, getPostsByCreator)
router.post('/', auth,createPost);
router.patch('/:id', auth, updatePost)
router.delete('/:id', auth, deletePost)
router.patch('/:id/likePost', auth, likePost)
router.patch('/:id/commentPost', auth, commentPost)


export default router;