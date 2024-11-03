import { Request, Response } from 'express';
import { createBlogPost, getAllBlogs, getDedicatedBlog, getBlogOnClick, updateBlog, checkBlogInUser, deleteBlog } from '../models/blog.model';
import { unlikeBlog, likeBlog, getBlogLikesData, getLikesCount } from '../models/like.model';
import { addComment, getComments } from '../models/comment.model';


export const createBlog = async (req: Request, res: Response): Promise<any> => {
    const { title, content } = req.body;
    const authorId = req.user?.id;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    try {
        const blog = await createBlogPost(title, content, authorId);
        return res.status(201).json(blog);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create blog post' });
    }
};


export const getBlogs = async (req: Request, res: Response): Promise<any> => {
    try {
        const blogs = await getAllBlogs();
        return res.status(200).json(blogs);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
};

export const getPersonalBlogs = async (req: Request, res: Response): Promise<any> => {
    const id = req.user?.id;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const blogs = await getDedicatedBlog(id);
        return res.status(200).json(blogs);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
};

export const updateBlogController = async (req: Request, res: Response): Promise<any> => {
    const blogId = req.params.id;
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized user' });
    }

    try {

        const checkBlog = await checkBlogInUser(userId, blogId);
        if (!checkBlog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found in your blogs',
            });
        }

        const updatedBlog = await updateBlog(title, content, blogId);

        return res.status(200).json({
            success: true,
            message: 'Blog successfully updated',
            updatedBlog,
        });
    } catch (e) {
        console.error('Error updating blog post:', e);
        return res.status(500).json({ error: 'Failed to update blog post' });
    }
};

export const deleteBlogController = async (req: Request, res: Response): Promise<any> => {
    const blogId = req.params.id;
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized user' });
    }
    try {
        const checkBlog = await checkBlogInUser(userId, blogId);
        if (!checkBlog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found in your blogs',
            });
        }

        await deleteBlog(blogId);

        return res.status(200).json({
            success: true,
            message: 'Blog successfully deleted'
        });
    } catch (error) {
        console.error("Error in deleteBlogController:", error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete blog'
        });
    }
};

export const likeBlogController = async (req: Request, res: Response): Promise<void> => {
    const blogId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized user' });
        return;
    }

    try {
        await likeBlog(userId, blogId);
        const likesCount = await getLikesCount(blogId);

        res.status(200).json({
            success: true,
            message: 'Blog liked successfully',
            likesCount
        });
    } catch (error) {
        console.error("Error in likeBlogController:", error);
        res.status(500).json({ error: 'Failed to like the blog' });
    }
};

export const unlikeBlogController = async (req: Request, res: Response): Promise<void> => {
    const blogId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized user' });
        return;
    }

    try {
        await unlikeBlog(userId, blogId);
        const likesCount = await getLikesCount(blogId);

        res.status(200).json({
            success: true,
            message: 'Blog unliked successfully',
            likesCount
        });
    } catch (error) {
        console.error("Error in unlikeBlogController:", error);
        res.status(500).json({ error: 'Failed to unlike the blog' });
    }
};

export const commentBlogController = async (req: Request, res: Response): Promise<any> => {
    const blogId = req.params.id;
    const userId = req.user?.id;
    const { content } = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized user' });
    }

    if (!content) {
        return res.status(400).json({ error: 'Comment content is required' });
    }

    try {
        await addComment(userId, blogId, content);
        const comments = await getComments(blogId);

        return res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            comments
        });
    } catch (error) {
        console.error("Error in commentBlogController:", error);
        return res.status(500).json({ error: 'Failed to add comment' });
    }
}

export const getBlogDetailsController = async (req: Request, res: Response): Promise<any> => {
    const blogId = req.params.id;

    try {
        const likesCount = await getLikesCount(blogId);
        const comments = await getComments(blogId);

        return res.status(200).json({
            success: true,
            likesCount,
            comments
        });
    } catch (error) {
        console.error("Error in getBlogDetailsController:", error);
        return res.status(500).json({ error: 'Failed to retrieve blog details' });
    }
};