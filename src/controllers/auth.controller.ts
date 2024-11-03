import { Request, Response } from 'express';
import { findUserByEmail, saveOtp, createUser, verifyOtp, deleteOtp } from '../models/user.model';
const bcrypt = require('bcrypt');
import dotenv from 'dotenv';
import { sendOtpEmail } from '../services/emailService';
const jwt = require('jsonwebtoken');

dotenv.config();

export const Register = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(403).json({ success: false, message: "All fields are required." });
        }

        const userPresent = await findUserByEmail(email);
        if (userPresent) {
            return res.status(401).json({ success: false, message: "User already exists." });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        await saveOtp(email, otpCode);

        await sendOtpEmail(email, otpCode);

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email for verification.",
            email,
            password
        });
    } catch (e) {
        console.error("Error during registration:", e);
        return res.status(500).json({ error: "User registration failed" });
    }
};

export const OtpVerify = async (req: Request, res: Response): Promise<any> => {
    const { email, otp, password } = req.body;

    try {
        const isOtpValid = await verifyOtp(email, otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const userId = await createUser(email, hashPassword);
        await deleteOtp(email);

        return res.status(201).json({ userId, message: "User registered successfully." });
    } catch (e) {
        console.error("Error during OTP verification:", e);
        return res.status(500).json({ error: "OTP verification failed." });
    }
};

export const Login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    const JWT_SECRET: string = process.env.JWT_SECRET || 'default_secret';

    try {
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const userPresent = await findUserByEmail(email);
        if (!userPresent) {
            return res.status(401).json({ error: "User not found. Please register." });
        }

        const isPasswordValid = await bcrypt.compare(password, userPresent.password_hash);
        if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials." });

        const token = jwt.sign({ id: userPresent.id, email: email }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } catch (e) {
        console.error("Error during login:", e);
        return res.status(500).json({ error: "Login failed" });
    }
};