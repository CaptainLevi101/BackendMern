import express from 'express';
import auth from '../middleware/auth.js';
import {getPostsBySearch ,getPosts,createPosts,updatePost,deletePost,likePost } from '../controllers/posts.js';
const router=express.Router();
router.get('/search',getPostsBySearch);
router.get('/',getPosts);
router.post('/',auth,createPosts);
router.patch('/:id',auth,updatePost);
router.delete('/:id',auth,deletePost);
router.patch('/:id/likePost',auth,likePost);
// router.patch('/:id',updatePost) //patch is used for updating existing document
export default router;