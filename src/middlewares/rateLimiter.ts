import { Request, Response, NextFunction } from 'express';

let requestCount: Record<string, number> = {};
const RATE_LIMIT = 5;
const TIME_WINDOW = 15 * 60 * 1000;

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
    const ip: any = req.ip;
    requestCount[ip] = (requestCount[ip] || 0) + 1;

    setTimeout(() => {
        requestCount[ip]--;
    }, TIME_WINDOW);

    if (requestCount[ip] > RATE_LIMIT) {
        return res.status(429).json({ message: "Too many requests, please try again later" });
    }

    next();
};
