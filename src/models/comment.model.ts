import pool from "../config/db";

interface Comment {
    id: number;
    content: string;
    username: string;
    created_at: Date;
}

export const addComment = async (userId: string, blogId: string, content: string): Promise<void> => {
    const query = `INSERT INTO comments (user_id, blog_id, content) VALUES ($1, $2, $3)`;
    try {
        await pool.query(query, [userId, blogId, content]);
        console.log("Comment added successfully");
    } catch (error) {
        console.error("Error adding comment:", error);
        throw new Error('Failed to add comment');
    }
};

export const getComments = async (blogId: string): Promise<Comment[]> => {
    const query = `
        SELECT c.id, c.content, u.email AS username, c.created_at
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.blog_id = $1
        ORDER BY c.created_at DESC
    `;

    try {
        const result = await pool.query(query, [blogId]);
        return result.rows;
    } catch (error) {
        console.error("Error retrieving comments:", error);
        throw new Error('Failed to retrieve comments');
    }
};