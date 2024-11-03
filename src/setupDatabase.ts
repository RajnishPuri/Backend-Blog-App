import pool from "./config/db";

export const createUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL
        );
    `;
    await pool.query(query);
};

export const createTemporaryOtpTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS temporary_otps (
            id SERIAL PRIMARY KEY,
            email VARCHAR(50) UNIQUE NOT NULL,
            otp_code VARCHAR(6) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await pool.query(query);
};

export const createBlogsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS blogs (
            id SERIAL PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            content TEXT NOT NULL,
            author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(query);
    } catch (error) {
        console.error("Error creating blogs table", error);
        throw error;
    }
};

export const createLikesTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS likes (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            blog_id INT REFERENCES blogs(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(query);
    } catch (error) {
        console.error("Error creating likes table", error);
        throw error;
    }
};

export const createCommentsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            blog_id INT REFERENCES blogs(id),
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(query);
    } catch (error) {
        console.error("Error creating comments table", error);
        throw error;
    }
};

export const initializeDatabase = async () => {
    try {
        await createUsersTable();
        await createTemporaryOtpTable();
        await createBlogsTable();
        await createLikesTable();
        await createCommentsTable();
        console.log("All tables created or already exist");
    } catch (error) {
        console.error("Error initializing database", error);
    }
};


