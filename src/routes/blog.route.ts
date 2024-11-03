import express from 'express';
import { createBlog, deleteBlogController, getBlogs, getPersonalBlogs, updateBlogController, likeBlogController, commentBlogController, getBlogDetailsController, unlikeBlogController } from '../controllers/blog.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const blogRouter = express.Router();

blogRouter.post('/createBlog', authenticateToken as any, createBlog);
blogRouter.get('/', getBlogs);
blogRouter.get('/personalBlog', authenticateToken as any, getPersonalBlogs);

blogRouter.put('/updateBlog/:id', authenticateToken as any, updateBlogController);

blogRouter.delete('/delete/:id', authenticateToken as any, deleteBlogController);

blogRouter.post('/:id/like', authenticateToken as any, likeBlogController);
blogRouter.post('/:id/comment', authenticateToken as any, commentBlogController);
blogRouter.post('/:id/unlike', authenticateToken as any, unlikeBlogController);

blogRouter.get('/:id/details', authenticateToken as any, getBlogDetailsController);

export default blogRouter;