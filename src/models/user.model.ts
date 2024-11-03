import pool from '../config/db';

export const createUser = async (email: string, passwordHash: string) => {
    try {
        const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id', [email, passwordHash]);
        return result.rows[0].id;
    } catch (e) {
        console.log("error in db", e);
        throw e;
    }
};

export const findUserByEmail = async (email: string) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    } catch (e) {
        console.log("here is the error", e);
        throw e;
    }
};

export const saveOtp = async (email: string, otpCode: string) => {
    try {
        const insertQuery = `
    INSERT INTO temporary_otps (email, otp_code, created_at) 
    VALUES ($1, $2, (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'))
`;
        await pool.query(insertQuery, [email, otpCode]);
    } catch (e) {
        console.error("Error saving OTP:", e);
        throw e;
    }
};

export const verifyOtp = async (email: string, otpCode: string) => {
    try {
        const result = await pool.query(
            `SELECT * FROM temporary_otps WHERE email = $1 AND otp_code = $2 AND created_at >= NOW() - INTERVAL '10 minutes'`,
            [email, otpCode]
        );
        return result.rows.length > 0;
    } catch (e) {
        console.error("Error verifying OTP:", e);
        throw e;
    }
};

export const deleteOtp = async (email: string) => {
    try {
        await pool.query(`DELETE FROM temporary_otps WHERE email = $1`, [email]);
    } catch (e) {
        console.error("Error deleting OTP:", e);
        throw e;
    }
};
