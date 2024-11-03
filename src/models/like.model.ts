import pool from "../config/db";

export const hasUserLikedBlog = async (userId: string, blogId: string): Promise<any> => {
    const query = `SELECT COUNT(*) FROM likes WHERE user_id = $1 AND blog_id = $2`;
    const result = await pool.query(query, [userId, blogId]);
    return parseInt(result.rows[0].count, 10) > 0;
};

export const likeBlog = async (userId: string, blogId: string): Promise<any> => {
    const alreadyLiked = await hasUserLikedBlog(userId, blogId);
    if (alreadyLiked) {
        throw new Error('User has already liked this blog');
    }

    const query = `INSERT INTO likes (user_id, blog_id) VALUES ($1, $2)`;
    await pool.query(query, [userId, blogId]);
    console.log("Blog liked successfully");
};

export const unlikeBlog = async (userId: string, blogId: string): Promise<any> => {
    const query = `DELETE FROM likes WHERE user_id = $1 AND blog_id = $2`;
    await pool.query(query, [userId, blogId]);
    console.log("Blog unliked successfully");
};

export const getBlogLikesData = async (userId: string, blogId: string): Promise<any> => {
    const likeCountQuery = `SELECT COUNT(*) FROM likes WHERE blog_id = $1`;
    const likeCountResult = await pool.query(likeCountQuery, [blogId]);
    const likeCount = parseInt(likeCountResult.rows[0].count, 10);

    const hasLiked = await hasUserLikedBlog(userId, blogId);

    return { likeCount, hasLiked };
};

export const getLikesCount = async (blogId: string): Promise<number> => {
    const query = `SELECT COUNT(*) FROM likes WHERE blog_id = $1`;
    const result = await pool.query(query, [blogId]);
    return parseInt(result.rows[0].count, 10);
};
