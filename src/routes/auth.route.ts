import express from 'express';
import { Register, Login, OtpVerify } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { rateLimiter } from '../middlewares/rateLimiter';

import { Request, Response } from 'express';

const authRouter = express.Router();

authRouter.post('/register', rateLimiter as any, Register);
authRouter.post('/login', Login);
authRouter.post('/verify-user', OtpVerify)
authRouter.get('/protected', authenticateToken as any, (req: Request, res: Response) => {
    res.send('This is a protected route.');
});

export default authRouter;
