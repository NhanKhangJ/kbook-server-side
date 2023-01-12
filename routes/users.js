import express from 'express';
import {signin, signup, getUser, updateUser } from '../controllers/user.js'
import auth from '../middleware/auth.js';
const router = express.Router();

router.get('/:id',auth, getUser);
router.patch('/:id',auth, updateUser)
router.post('/signin',signin);
router.post('/signup',signup);

export default router;