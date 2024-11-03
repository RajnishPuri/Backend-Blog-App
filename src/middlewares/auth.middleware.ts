import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { id: number; email: string };

        req.user = { id: decoded.id, email: decoded.email };

        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};
