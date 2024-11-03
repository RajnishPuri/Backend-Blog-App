import pool from '../config/db';

// Create new blog
export const createBlogPost = async (title: string, content: string, authorId: number) => {
    const query = `
        INSERT INTO blogs (title, content, author_id) 
        VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [title, content, authorId];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getAllBlogs = async () => {
    const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    return result.rows;
};

// It is for all the blogs of that particular user
export const getDedicatedBlog = async (userId: string) => {
    const query = `SELECT * FROM blogs WHERE author_id = $1 ORDER BY created_at DESC`;

    try {
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw new Error('Failed to retrieve blogs');
    }
};

// It is for clicking the personalized blog selection in frontend
export const getBlogOnClick = async (blogId: string) => {
    const query = `SELECT * FROM blogs WHERE id = $1`;

    try {
        const result = await pool.query(query, [blogId]);
        return result.rows;
    } catch (e) {
        console.error("Error retrieving blog post:", e);
        throw new Error('Failed to retrieve blog');
    }
};

// It will use in updating the blog 
export const updateBlog = async (title: string, content: string, blogId: string) => {
    const updateQuery = `UPDATE blogs SET title = $1, content = $2 WHERE id = $3 RETURNING *`;
    try {
        const result = await pool.query(updateQuery, [title, content, blogId]);
        return result.rows[0];
    }
    catch (e) {
        console.error("Error while Updating Blog:", e);
        throw new Error('Failed to Update blog');
    }
}

// It will use in finding the authentication of that blog is the true user or not
export const checkBlogInUser = async (userId: string, blogId: string) => {
    const query = `SELECT * FROM blogs WHERE id = $1 AND author_id = $2`;

    try {
        const result = await pool.query(query, [blogId, userId]);
        return result.rows.length > 0;
    } catch (error) {
        console.error("Error checking blog ownership:", error);
        throw new Error('Failed to verify blog ownership');
    }
};

export const deleteBlog = async (blogId: string) => {
    const query = `DELETE FROM blogs WHERE id = $1`;

    try {
        const result = await pool.query(query, [blogId]);

        if (result.rowCount === 0) {
            throw new Error('Blog not found');
        }
    } catch (error) {
        console.error("Error deleting blog:", error);
        throw new Error('Failed to delete blog');
    }
};